require 'nanoc3/tasks'

# Add tasks/lib and lib to the LOAD_PATH
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'tasks', 'lib'),
		   File.join(File.dirname(__FILE__), 'lib'))

# Audio root incoming directory
AUDIO_ROOT = ENV['AUDIO_ROOT'] || '/var/www/audio_uploads/incoming'
# Audio root processed directory
AUDIO_PROCESSED_ROOT = '/var/www/audio_uploads/processed'
# nanoc content root directory
CONTENT_ROOT = File.join(File.dirname(__FILE__), 'content')
# metadata root directory
META_ROOT =  File.join(CONTENT_ROOT, 'audio')
# Rackspace Cloud Files audio container HTTP root
HTTP_AUDIO_ROOT = 'http://c359179.r79.cf2.rackcdn.com'

# Map of path mappings for audio files used for the original site conversion.
#   /sunday_bible_message       => studies/bc2
#   /sunday_bible_study         => studies/bc1
#   /sunday_open_forum          => questions/of
#   /q_and_a                    => questions/web
#   /unto_the_end_of_the_world  => studies/unto-the-end

# Speakers lookup hash to get full name
SPEAKERS = {
  'Berry' => 'Guy Berry',
  'Daniels' => 'Robert Daniels',
  'Exum' => 'Ron Exum',
  'McCann' => 'Chris McCann',
  'McOwen' => 'John McOwen',
  'Seifert' => 'Greg Seifert',
  'Tubbs' => 'Reuben Tubbs',
  'von_Harringa' => 'Gunther von Harringa, Sr.'
}

# Load any tasks in the tasks/ folder
Dir["tasks/*.rake"].each { |ext| load ext }

desc 'Issue a nanoc compile'
task :compile do
  system("umask 002; nanoc compile |egrep -v 'identical|skip'")
end

