namespace :deploy do

  desc "Deploy audio files, generate metadata and stub files"
  task :audio do
    require 'fileutils'
    require 'cloud_utils'
    cloud_utils = CloudUtils.new(:username => 'ebiblefellowship',
                                 :api_key => ENV['RACKSPACE_API_KEY'], :container => 'audio')
    Dir.chdir(AUDIO_ROOT) do
      Dir.glob('**/*.mp3').each do |mp3_file|
        puts "** processing #{mp3_file} ..."
        # Relative directory and filename less extension and possible -draft suffix
        base_path = mp3_file.sub(/(\-draft)?\.mp3$/,'')
        # Relative directory
        base_dir = File.dirname(base_path)
        # Upload file to Cloud Files
        object = cloud_utils.upload(mp3_file, base_dir)
        # Create or update audio metadata file
        meta_file = update_meta_from_mp3(mp3_file, :url => object.public_url)
        # Generate Markdown stub
        stub_file = generate_markdown_stub(base_path, meta_file)
        # Move processed .mp3 file from incoming to processed folder
        FileUtils.mkdir_p(File.join(AUDIO_PROCESSED_ROOT, base_dir))
        FileUtils.mv(mp3_file, File.join(AUDIO_PROCESSED_ROOT, mp3_file),
                     :force => true, :verbose => true, :noop => false)
        # Git add meta file.  Stub is not added because it requires editing.
        system("cd #{CONTENT_ROOT}; git add #{meta_file}")
      end
    end
  end

end

# Create audio meta file from mp3 file
def update_meta_from_mp3(mp3_file, options = {})
  require 'audio_file'
  meta_file = File.join(META_ROOT, mp3_file.sub(/\.mp3$/,'.yaml'))
  # Fellowship Hour sometimes has a -draft.mp3 suffix. Remove so not in meta file name.
  meta_file.sub!(/-draft/,'')
  mp3_mtime = File.mtime(mp3_file)
  meta_mtime = File.exists?(meta_file) ? File.mtime(meta_file) : nil
  url = options[:url]
  http_root = options[:http_root]
  # determine if meta file should be updated
  ##return if mp3_mtime == meta_mtime
  # gxtract metadata
  #puts "reading file #{mp3_file}"
  mp3 = AudioFile.new(mp3_file)
  #puts "loading tag for #{mp3_file}"
  metadata = {
    'title'       => mp3.title,
    'artist'      => mp3.artist,
    'album'       => mp3.album,
    'genre'       => mp3.genre,
    'comment'     => mp3.comment,
    'length'      => mp3.length_fmt,
    'bitrate'     => mp3.bitrate_fmt,
    'sample_rate' => mp3.sample_rate_fmt,
    'size'        => mp3.size_fmt,
    'url'         => url ? url : (http_root + mp3.filename.sub(%r{^(#{AUDIO_ROOT})},'')),
    'is_hidden'   => true
  }.delete_if { |k,v| v.nil? or v == ''}
  # Write extracted metadata
  #puts "writing metadata for #{mp3_file}"
  FileUtils.mkdir_p(File.dirname(meta_file))
  File.open(meta_file, 'w') { |io| io.write(YAML.dump(metadata)) }
  # Set the mtime to the same value as the mp3 file
  #File.mtime(meta_file) = mp3_mtime
  meta_file
end

# Generate Markdown file based on audio metadata files.
def generate_markdown_stub(base_path, meta_file)
  require 'yaml'

  # Calculate the stub name
  stub_file = File.join(CONTENT_ROOT, base_path + '.md')

  # Don't overwrite already existing stub file.  This should only happen
  # if an audio file is being republished.
  if File.exists?(stub_file)
    puts "*** stub file #{stub_file} exists!  skipping ..."
    return
  end
  puts "*** creating stub file #{stub_file}"

  yaml_meta = YAML.load_file(meta_file)

  # parse filename to get defaults
  file_meta = parse_dated_file(File.basename(meta_file, '.yaml'))

  # load yaml data to use title and speaker if they exist from the MP3 ID3 tags
  metadata = {
    'title' => yaml_meta['title'] || file_meta['title'],
    'speaker' => yaml_meta['speaker'] || file_meta['speaker'],
    'created_at' => file_meta['created_at'],
    'slug' => file_meta['slug'],
    'description' => 'Write a brief description',
    'audio' => [ meta_file.sub(%r{^#{META_ROOT.sub(%r{/audio$},'')}}, '') ]
  }
  metadata['description'] = 'Various questions and answers from the Bible' if
    metadata['title'] =~ /Question|Open Forum|Fellowship Hour/

  # write out .html file
  FileUtils.mkdir_p(File.dirname(stub_file))
  File.open(stub_file, 'w') do |io|
    io.write(YAML.dump(metadata))
    io.puts("---")
  end
  stub_file
end

# parse filename and extract date, speaker and title returning a Hash
def parse_dated_file(file)
  require 'to_slug'
  String.send(:include, ToSlug)  # add to_slug method to String class
  meta = {}
  if file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_Fellowship_Hour}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = 'Chris McCann'
    meta['title'] = "Fellowship Hour for #{meta['created_at']}"
    meta['slug'] = 'fellowship-hour'
  elsif file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_(\w+)_-_(.+)}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = SPEAKERS[$2] || $2
    meta['title'] = $3.tr('_',' ')
    meta['slug'] = meta['title'].to_slug
    meta['title'] = meta['title'] + ' for ' + meta['created_at'] if meta['title'] =~ /Open Forum/
  elsif file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_-_(.+)}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = 'Chris McCann'
    meta['title'] = $2.tr('_',' ')
    meta['slug'] = meta['title'].to_slug
  end
  meta
end

