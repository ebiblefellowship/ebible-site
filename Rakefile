require 'nanoc3/tasks'

# Load any tasks in the tasks/ folder
Dir["tasks/*.rake"].each { |ext| load ext }

# original by Denis Dufresne (http://gist.github.com/657855)

require 'yaml'

$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'lib'))
require 'audio_file'
require 'to_slug'
String.send(:include, ToSlug)  # add to_slug method to String class

MP3_ROOT = '/var/www/html'
DOC_ROOT = '/var/www/html'
AUDIO_ROOT = '/var/www/assets/audio'
META_ROOT =  '/var/www_staging/sitegen/content/audio'
CONTENT_ROOT =  '/var/www_staging/sitegen/content'
HTTP_AUDIO_ROOT = 'http://assets.ebiblefellowship.com/audio'
MP3_META_DIRS_MAP = [
  { :mp3 => "#{DOC_ROOT}/sunday_bible_message",      :meta => 'studies/bc2',
    :http_root => '' },
  { :mp3 => "#{DOC_ROOT}/sunday_bible_study",        :meta => 'studies/bc1',
    :http_root => '' },
  { :mp3 => "#{DOC_ROOT}/sunday_open_forum",         :meta => 'questions/of',
    :http_root => '' },
  { :mp3 => "#{DOC_ROOT}/q_and_a",                   :meta => 'questions/web',
    :http_root => '' },
  { :mp3 => "#{DOC_ROOT}/unto_the_end_of_the_world", :meta => 'studies/unto-the-end',
    :http_root => '' },
  { :mp3 => "#{AUDIO_ROOT}/studies/conferences",     :meta => 'studies/conferences',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/fh",            :meta => 'questions/fh',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/conferences",   :meta => 'questions/conferences',
    :http_root => HTTP_AUDIO_ROOT }
]
# Only 2009 and 2010
MP3_SELECT_GLOB = '*20[01][019].[0-9][0-9].[0-9][0-9]*.mp3'

# Speakers lookup hash to get full name
SPEAKERS = {
  'Berry' => 'Guy Berry',
  'Daniels' => 'Robert Daniels',
  'Exum' => 'Ron Exum',
  'James' => 'Oliver James',
  'McCann' => 'Chris McCann',
  'McOwen' => 'John McOwen',
  'Seifert' => 'Greg Seifert'
}

# Create audio meta file from mp3 file
def update_meta_from_mp3(mp3_file, meta_file, http_root)
  mp3_mtime = File.mtime(mp3_file)
  meta_mtime = File.exists?(meta_file) ? File.mtime(meta_file) : nil
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
    'url'         => http_root + mp3.filename.sub(%r{^(#{DOC_ROOT}|#{AUDIO_ROOT})},''),
    'is_hidden'   => true
  }.delete_if { |k,v| v.nil? or v == ''}
  # Write extracted metadata
  #puts "writing metadata for #{mp3_file}"
  FileUtils.mkdir_p(File.dirname(meta_file))
  File.open(meta_file, 'w') { |io| io.write(YAML.dump(metadata)) }
  # Set the mtime to the same value as the mp3 file
  #File.mtime(meta_file) = mp3_mtime
end

# parse filename and extract date, speaker and title returning a Hash
def parse_dated_file(file)
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

# Rule to create html page files if one doesn't exist based on the mp3 yaml file
rule %r{^#{CONTENT_ROOT}.*\.html$} => [
  proc { |tn| tn.sub(%r{^#{CONTENT_ROOT}}, META_ROOT).ext('yaml') }
] do |t|

  # Don't overwrite already existing html file
  if File.exists?(t.name)
    #puts "    ... skipping ..."
    next
  end

  puts "*** creating html page #{t.name} (eventually)"

  yaml_meta = YAML.load_file(t.source)

  file_meta = parse_dated_file(File.basename(t.source, '.yaml'))

  # load yaml data to use title and speaker if they exist from the MP3 ID3 tags
  metadata = {
    'title' => yaml_meta['title'] || file_meta['title'],
    'speaker' => yaml_meta['speaker'] || file_meta['speaker'],
    'created_at' => file_meta['created_at'],
    'slug' => file_meta['slug'],
    'audio' => [ t.source.sub(%r{^#{META_ROOT.sub(%r{/audio$},'')}}, '') ]
  }

  # write out .html file
  FileUtils.mkdir_p(File.dirname(t.name))
  File.open(t.name, 'w') do |io|
    io.write(YAML.dump(metadata))
    io.puts("---")
  end
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

desc "Update audio metadata files by scanning MP3's"
task :update do
  MP3_META_DIRS_MAP.each do |d|
    Dir.glob(File.join(d[:mp3], MP3_SELECT_GLOB)).each do |mp3_file|
      #mp3_files << mp3_file
      meta_file = File.join(META_ROOT, d[:meta], File.basename(mp3_file, '.mp3') + '.yaml')
      # Fellowship Hour sometimes has a -draft.mp3 suffix. Remove so not in meta file name.
      meta_file.sub!(/-draft/,'')
      #meta_files << meta_file
      update_meta_from_mp3(mp3_file, meta_file, d[:http_root])
    end
  end
end

desc 'Create HTML stubs for correspending audio metadata files'
task :create do
  Dir[META_ROOT + '/**/*.yaml'].each do |source|
    target = source.sub(%r{^#{META_ROOT}}, CONTENT_ROOT).ext('html')
    Rake::Task[target].invoke
  end
end

desc 'Issue a nanoc compile'
task :compile do
  system('umask 002; nanoc compile |egrep -v identical')
end

