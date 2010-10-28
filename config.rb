# This is the Compass configuration file for scss and sass file processing.
# Compass Configuration Reference: 
#   http://compass-style.org/docs/tutorials/configuration-reference/
#
# The compass utility looks for certain configuration file names by default.
# If this file is renamed it must match one of the supported names or the 
# compass command won't find it unless the --config option is specified.

require 'bundler/setup'

# Load Compass plugins
require 'susy'

#
# Compass configuration properties
#
# As nanoc utilizes has content (source) and output (target) directories,
# configuring the options below needs to take this into account.  The
# current version of compass (0.15.5) does not support source and target
# project paths.
#

# Not needed in :stand_alone mode where it can be inferred by context. 
# Sets the path to the root of the project.
##project_path = File.dirname(__FILE__)

# http_path - The path to the project when running within the web
http_path    = '/generated'

# environment - The environment mode. Defaults to :production, can 
# also be :development
##environment  = :development

# The target directory where the css stylesheets are kept. 
# Relative to the project_path.
css_dir      = 'output/stylesheets'

# The full http path to stylesheets on the web server
http_stylesheets_path = "#{http_path}/stylesheets"

# The source directory where the sass stylesheets are kept.
# Relative to the project_path.
sass_dir     = 'content/stylesheets'

# The source directory where the images are kept.
# Relative to the project_path.
images_dir   = 'output/images'  # use output 'cause not hosting images

# The full http path to images on the web server.
http_images_path = "#{http_path}/images"

# The output style for the compiled css.
#   :nested     - Each CSS rule and property on a separate line, 
#                 Rules are indented based on nesting.
#   :expanded   - Each CSS rule and property on a separate line.
#   :compact    - Each CSS rule on a single line
#   :compressed - Minimum amount of space with almost no whitespace
# For more details, on sass output styles, see
#   http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
output_style = :nested

# Indicates whether the compass helper functions should generate 
# relative urls from the generated css to assets, or absolute urls 
# using the http path for that asset type.
relative_assets = false

# Options passed directly to the Sass compiler. 
# Must be defined in this file to work with compass command.
# For more details on the sass options, see 
#   http://sass-lang.com/docs/yardoc/SASS_REFERENCE.md.html#options
sass_options = {
  :syntax => :scss,  # use SCSS syntax
  :full_exception => true,
  :line_numbers => true
}

