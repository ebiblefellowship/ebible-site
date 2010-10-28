# See http://nanoc.stoneship.org/docs/4-basic-concepts/#helpers
# and API docs at http://nanoc.stoneship.org/docs/api/3.1/Nanoc3/Helpers.html
#
# Examples:
# - HE3RALD site: http://github.com/h3rald/h3rald/blob/master/lib/helpers.rb
# - unthinkingly site: http://github.com/unthinkingly/unthinkingly-blog/blob/master/lib/helpers.rb
#
#include Nanoc3::Helpers::Blogging
#include Nanoc3::Helpers::Filtering
#include Nanoc3::Helpers::HTMLEscape
#include Nanoc3::Helpers::LinkTo
#
# <%= render 'partial-name' [ args ... ] %>
# http://nanoc.stoneship.org/docs/api/3.1/Nanoc3/Helpers/Rendering.html
include Nanoc3::Helpers::Rendering
include Nanoc3::Helpers::Breadcrumbs
include Nanoc3::Helpers::LinkTo
include Nanoc3::Helpers::XMLSitemap

