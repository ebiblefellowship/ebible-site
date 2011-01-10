#!ruby
# This rack configuration file is used as a replacement for the nanoc view
# command by using the rackup command instead.  The advantage of this 
# approach is redirects and other custom behavior can be specified.
#
# Rack-rewrite (https://github.com/jtrupiano/rack-rewrite) is used for local
# and client-side rewrites.
#
# See http://nanoc.stoneship.org/docs/api/3.1/Nanoc3/CLI/Commands/View.html
#   run() method for the view command
#

require 'bundler'
Bundler.setup(:default, :server)

require 'nanoc3'
require 'rack/rewrite'
require 'adsf'

# Just load enough of nanoc to get access to the configuration
site = Nanoc3::Site.new('.')

# Custom URL rewrites
use Rack::Rewrite do
  # /generated => /
  rewrite %r{^/generated(.*)$}, '$1'
  # /images, /gallery => http://www.ebiblefellowship.com/images, /gallery
  r302 %r{^/(images|gallery)(.*)$}, 'http://www.ebiblefellowship.com/$1$2'
end

use Adsf::Rack::IndexFileFinder, :root => site.config[:output_dir]
use Rack::Deflater
use Rack::ETag
run Rack::File.new(site.config[:output_dir])

