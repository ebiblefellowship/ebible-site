namespace :list do

  desc "List audio files pending deployment"
  task :audio, :dir do |t, args|
    if File.directory?(AUDIO_ROOT)
      Dir.chdir(AUDIO_ROOT)
      require 'audio_file'
      puts "** Audio files in: #{AUDIO_ROOT}:"
      args.with_defaults(:dir => nil)
        Dir.glob(File.join('**', '*.mp3')).sort.each do |mp3_file|
          mp3 = AudioFile.new(mp3_file)
          puts <<EOT
--------------------
#{mp3_file}
  Size: #{mp3.size}; Duration: #{mp3.length}; Bitrate: #{mp3.bitrate_fmt}; Sample rate: #{mp3.sample_rate_fmt}
  Title: #{mp3.title}
  Artist: #{mp3.artist}
  Album: #{mp3.album}
  Genre: #{mp3.genre}
  Comment: #{mp3.comment}
EOT
        end
      #end
    else
      $stderr.puts "** ERROR: audio root folder #{AUDIO_ROOT} is not available here"
    end
  end

end

