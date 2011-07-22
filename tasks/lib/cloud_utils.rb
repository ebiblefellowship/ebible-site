# simple interface to Rackspace Cloud Files

require 'cloudfiles'
require 'digest/md5'

class CloudUtils

  attr_accessor :username, :api_key, :container
  attr_reader :connection

  def initialize(options = {})
    @username = options[:username] ||= ENV['RACKSPACE_USERNAME']
    @api_key = options[:api_key] ||= ENV['RACKSPACE_API_KEY']
    @connection = CloudFiles::Connection.new(:username => @username, :api_key => @api_key,
      :snet => (options[:snet] ||= true))
    @container = @connection.container(options[:container])
  end

  # @options :dry_run => { :type => :boolean, :alias => :n }
  # upload a file to a storage object and return the object
  def upload(src_file, dest_prefix, options = {})
    object = nil
    object_name = "#{dest_prefix}/#{File.basename(src_file)}"
    if options[:dry_run]
      puts "dry_run: upload file #{src_file} as object #{object_name}"
    else
      src_file_md5 = Digest::MD5.file(src_file).to_s
      object = @container.object(object_name) rescue nil
      if !object.nil? and object.etag.eql?(src_file_md5)
        puts "skipping--identical file #{src_file} to object #{object_name}"
      else
        puts "#{object.nil? ? 'creating' : 'updating'} file #{src_file} as object #{object_name} ..."
        # Create object
        object = @container.create_object(object_name, false)
        # Upload a file using a data stream
        object.load_from_filename(src_file, {}, true)  #:Etag => src_file_md5)
      end
    end
    object
  end

  # @options :dry_run => { :type => :boolean, :alias => :n }
  # delete a storage object
  def delete(object_name, options = {})
    if options[:dry_run]
      puts "dry_run: delete object #{object_name}"
    else
      puts "deleting object #{object_name}"
      @container.delete_object(object_name)
    end
  end

  # @options :prefix=>:string
  # list files in the current container
  def ls(options = {})
    @container.objects(:prefix => options[:prefix]).each do |name|
      object = @container.object(name)
      puts <<EOT
container: #{object.container.name}
name: #{object.name}
public_url: #{object.public_url}
size in bytes: #{object.bytes}
last modified: #{object.last_modified}
etag: #{object.etag}
content type: #{object.content_type}
metadata: #{object.metadata}
EOT
    end
  end

end
