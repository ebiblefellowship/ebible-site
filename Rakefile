require 'nanoc3/tasks'

# original by Denis Dufresne (http://gist.github.com/657855)

#require 'yaml'

# Add tasks/lib and lib to the LOAD_PATH
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'tasks', 'lib'),
		   File.join(File.dirname(__FILE__), 'lib'))
#require 'to_slug'
#String.send(:include, ToSlug)  # add to_slug method to String class

MP3_ROOT = '/var/www/html'
DOC_ROOT = '/var/www/html'
AUDIO_ROOT = ENV['AUDIO_ROOT'] || '/var/www/audio_uploads/incoming'
AUDIO_PROCESSED_ROOT = '/var/www/audio_uploads/processed'
CONTENT_ROOT = File.join(File.dirname(__FILE__), 'content')
META_ROOT =  File.join(CONTENT_ROOT, 'audio')
HTTP_AUDIO_ROOT = 'http://c359179.r79.cf2.rackcdn.com'  # audio container
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
  { :mp3 => "#{AUDIO_ROOT}/studies/sunday",          :meta => 'studies/sunday',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/studies/friday",          :meta => 'studies/friday',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/studies/conferences",     :meta => 'studies/conferences',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/sunday",        :meta => 'questions/sunday',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/friday",        :meta => 'questions/friday',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/single",        :meta => 'questions/single',
    :http_root => HTTP_AUDIO_ROOT },
  { :mp3 => "#{AUDIO_ROOT}/questions/conferences",   :meta => 'questions/conferences',
    :http_root => HTTP_AUDIO_ROOT }
]
# Only 2009 and 2010
#MP3_SELECT_GLOB = '*20[01][019].[0-9][0-9].[0-9][0-9]*.mp3'
MP3_SELECT_GLOB = '*.mp3'

# Speakers lookup hash to get full name
SPEAKERS = {
  'Berry' => 'Guy Berry',
  'Brown' => 'Kevin Brown',
  'Daniels' => 'Robert Daniels',
  'Exum' => 'Ron Exum',
  'James' => 'Oliver James',
  'McCann' => 'Chris McCann',
  'McOwen' => 'John McOwen',
  'Seifert' => 'Greg Seifert'
}

# Load any tasks in the tasks/ folder
Dir["tasks/*.rake"].each { |ext| load ext }

=begin
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

desc 'Create HTML stubs for correspending audio metadata files'
task :create do
  Dir[META_ROOT + '/**/*.yaml'].each do |source|
    target = source.sub(%r{^#{META_ROOT}}, CONTENT_ROOT).ext('html')
    Rake::Task[target].invoke
  end
end
=end

desc 'Issue a nanoc compile'
task :compile do
  system('umask 002; nanoc compile |egrep -v identical')
end

