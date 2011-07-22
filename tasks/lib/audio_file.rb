#!/usr/bin/env ruby

require 'rubygems'
#require 'taglib2'
require 'mp3info'

# Monkey patch Numeric class to add our own convenience conversions
# See http://warrenseen.com/blog/2007/02/22/ruby-cheap-tricks-monkeypatching-unit-conversion/
class Numeric
  # Methods for file sizes
  def bytes
    self
  end
  alias :byte :bytes
  def kilobytes
    self.bytes * 1024
  end
  alias :kilobyte :kilobytes
  def megabytes
    self.kilobytes * 1024
  end
  alias :megabyte :megabytes
  # Methods for time
  def seconds
    self
  end
  alias :second :seconds
  def minutes
    self.seconds * 60
  end
  alias :minute :minutes
  def hours
    self.minutes * 60
  end
  alias :hour :hours
end

class AudioFile
  attr_accessor :filename, :title, :artist, :album, :genre, :comment, 
    :length, :bit_rate, :sample_rate, :size

  def initialize(filename = nil)
    unless filename.nil?
      @filename = filename
      @size = File.size(filename)
      Mp3Info.open(filename) do |mp3|
        unless mp3.tag.nil?
          @title = mp3.tag.title
          @artist = mp3.tag.artist
          @album = mp3.tag.album
          @genre = mp3.tag.genre
          @comment = mp3.tag.comment
        end
        @length = mp3.length.round
        @bitrate = mp3.bitrate
        @sample_rate = mp3.samplerate
      end if File.extname(filename).eql?('.mp3')
      #@tf = TagLib2::File.new(filename)
      #@title = @tf.title
      #@artist = @tf.artist
      #@album = @tf.album
      #@genre = @tf.genre
      #@comment = @tf.comment
      #@length = @tf.length
      #@bitrate = @tf.bitrate
      #@sample_rate = @tf.sample_rate
    end
  end

  # An alias for #artist
  def speaker
    @artist
  end

  # An alias for #artist=
  def speaker=
    @artist = value
  end

  def length_fmt
    if @length.nil?
      'unknown length'
    elsif @length < 1.hour
      sprintf('%d:%02d', @length/1.minute, @length%1.minute)
    else
      hours = @length/1.hour
      next_length = @length - hours*1.hour
      minutes = next_length/1.minute
      seconds = next_length%1.minute
      sprintf('%d:%02d:%02d', hours, minutes, seconds)
    end
  end
  
  # Returns the bit rate with a 'Kbps' suffix
  def bitrate_fmt
    "#{@bitrate.nil? ? 'unknown' : @bitrate} Kbps"
  end

  # Returns the sample rate with 'Hz' suffix
  def sample_rate_fmt
    "#{@sample_rate.nil? ? 'unknown' : @sample_rate} Hz"
  end

  # Returns the #size rounded in the appropriate range of bytes,
  # kilobytes (KB) and megabytes (MB) with a 'bytes', 'KB' or 'MB'
  # suffix
  def size_fmt
    if @size.nil?
      'unknown size'
    elsif @size >= 1.kilobyte && @size < 1.megabyte
      sprintf('%0.1f KB', @size.to_f / 1.kilobyte)
    elsif @size >= 1.megabyte
      sprintf('%0.1f MB', @size.to_f / 1.megabyte)
    else
      "#{@size} bytes"
    end
  end

  # Returns the date parsed from file if available
  def file_date
    require 'date'
    base_file = File.basename(@filename)
    if base_file =~ /_?(\d{4})\.(\d\d)\.(\d\d)_?/
      yyyy, mm, dd = $1, $2, $3
      Date.new(yyyy.to_i, mm.to_i, dd.to_i).strftime('%Y-%m-%d')
    else
      nil
    end
  end

  def to_s
    %Q{Filename: #{@filename}
Title: #{@title}
Artist: #{@artist}
Album: #{@album}
Genre: #{@genre}
Comment: #{@comment}
Length: #{@length}
Length formatted: #{length_fmt}
Bitrate: #{@bitrate}
Bitrate formatted: #{bitrate_fmt}
Sample rate: #{@sample_rate}
Sample rate formatted: #{sample_rate_fmt}
Size: #{@size}
Size formatted: #{size_fmt}
}
  end

  def to_yaml_fmt
    %Q{---
title: #{@title}
speaker: #{@artist}
date: #{file_date}
audio:
  url: 
  filename: #{@filename}
  album: #{@album}
  genre: #{@genre}
  comment: #{@comment}
  length: '#{length_fmt}'
  bitrate: #{bitrate_fmt}
  sample_rate: #{sample_rate_fmt}
  size: #{size_fmt}
---
}
  end

end

if __FILE__ == $0
  ARGV.each do |file|
    puts AudioFile.new(file).to_yaml_fmt
  end
end

