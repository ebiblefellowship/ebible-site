namespace :deploy do

  desc "Deploy audio files and generate audio metadata files"
  task :audio, :dir do |t, args|
    args.with_defaults(:dir => nil)
    require 'cloud_utils'
    require 'fileutils'
    cloud_utils = CloudUtils.new(:username => 'ebiblefellowship', :api_key => ENV['RACKSPACE_API_KEY'], :container => 'audio')
    MP3_META_DIRS_MAP.each do |d|
      next unless args[:dir].nil? or d[:meta].eql?(args[:dir])
      puts "** Deploying #{d[:meta]}"
      Dir.glob(File.join(d[:mp3], MP3_SELECT_GLOB)).each do |mp3_file|
        #mp3_files << mp3_file
        meta_file = File.join(META_ROOT, d[:meta], File.basename(mp3_file, '.mp3') + '.yaml')
        # Fellowship Hour sometimes has a -draft.mp3 suffix. Remove so not in meta file name.
        meta_file.sub!(/-draft/,'')
        # Upload file to Cloud Files
        object = cloud_utils.upload(mp3_file, d[:meta])
        #meta_files << meta_file
        update_meta_from_mp3(mp3_file, meta_file, :url => object.public_url)
        # Move processed .mp3 file from incoming to processed folder
        FileUtils.mv(mp3_file, 
                     File.join(AUDIO_PROCESSED_ROOT, d[:meta], File.basename(mp3_file)),
                     :force => true, :verbose => true, :noop => false)
        # Git add meta file
        system("git add #{meta_file}")
      end
    end
  end

end

# Create audio meta file from mp3 file
def update_meta_from_mp3(mp3_file, meta_file, options = {})
  require 'audio_file'
  mp3_mtime = File.mtime(mp3_file)
  meta_mtime = File.exists?(meta_file) ? File.mtime(meta_file) : nil
  url = options[:url]
  http_root = options[:http_root]
  # determine if meta file should be updated
  ##return if mp3_mtime == meta_mtime
  # gxtract metadata
  puts "reading file #{mp3_file}"
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
    'url'         => url ? url : (http_root + mp3.filename.sub(%r{^(#{DOC_ROOT}|#{AUDIO_ROOT})},'')),
    'is_hidden'   => true
  }.delete_if { |k,v| v.nil? or v == ''}
  # Write extracted metadata
  #puts "writing metadata for #{mp3_file}"
  FileUtils.mkdir_p(File.dirname(meta_file))
  File.open(meta_file, 'w') { |io| io.write(YAML.dump(metadata)) }
  # Set the mtime to the same value as the mp3 file
  #File.mtime(meta_file) = mp3_mtime
end

=begin
# Default: copy MP3s and extra metadata
mp3_files = meta_files = []
MP3_META_DIRS_MAP.each do |d|
  Dir.glob(File.join(MP3_ROOT, d[:mp3], MP3_SELECT_GLOB)).each do |mp3_file|
    mp3_files << mp3_file
    meta_file = File.join(META_ROOT, d[:meta], File.basename(mp3_file, '.mp3') + '.yaml')
    meta_files << meta_file
    file meta_file => [ mp3_file, CONTENT_ROOT ] do |t|
      update_meta_from_mp3(t.source, t.name)
    end
  end
end
=end

