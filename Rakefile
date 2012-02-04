require 'nanoc3/tasks'

# Add tasks/lib and lib to the LOAD_PATH
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'tasks', 'lib'),
		   File.join(File.dirname(__FILE__), 'lib'))

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
  { :mp3 => "#{AUDIO_ROOT}/questions/sessions",      :meta => 'questions/sessions',
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
  'Seifert' => 'Greg Seifert',
  'von_Harringa' => 'Gunther von Harringa, Sr.'
}

# Load any tasks in the tasks/ folder
Dir["tasks/*.rake"].each { |ext| load ext }

desc 'Issue a nanoc compile'
task :compile do
  system("umask 002; nanoc compile |egrep -v 'identical|skip'")
end

