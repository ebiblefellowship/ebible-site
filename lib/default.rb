# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.
require "bundler/setup"
require 'uri'
require 'time'
require 'cgi'

# All content has a filename with a date
CONTENT_SELECTION = %r{\d\d\d\d[.-]\d\d[.-]\d\d}

def base_url
  @site.config[:base_url]
end

def css_url
  @site.config[:css_url]
end

def images_url
  @site.config[:images_url]
end

# Given an MP3 URI, convert to an .m3u URL
def m3u_url(mp3_uri)
  # if parameter starts with a '/', the mp3 is on www.ebiblefellowship.com
  url = (mp3_uri.strip[0] == '/') ? 'http://www.ebiblefellowship.com' + mp3_uri : mp3_uri
  base_url + '/m3u.php?url=' +
      URI.escape(url, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]")) +
      '&amp;ext=.m3u'
end

# HTML escape text or value of an attribute of the current item by passing a 
# symbol of that attribute.
def h(text)
  case
  when text.nil? then nil
  when text.is_a?(Symbol) then CGI.escapeHTML(@item[text])
  else CGI.escapeHTML(text)
  end
end

def home_page?
    @item.identifier == '/'
end

# convert a local time to GMT: '10:30AM' => '15:30'
def local_to_gmt_time(t)
  Time.parse(t).utc.strftime('%H:%M')
end

def formatted_date(date)
  Time.parse(date).strftime('%d-%b-%Y') unless date.nil?
end

def to_month_s(month)
  Date.new(2010, month).strftime("%b")
end

def to_month_full_s(month)
  Date.new(2010, month.is_a?(String) ? month.to_i : month).strftime("%B")
end

def sorted_articles(relevant_articles, limit = 100)
  sorted_relevant_articles = relevant_articles.sort_by do |a|
    time = a[:created_at]
    time.is_a?(String) ? Time.parse(time) : time
  end.reverse.first(limit)
end

# Find by identifier
def find_item(identifier)
  @items.find { |i| i.identifier == identifier } ||
    raise(Exception, "item not found with identifier == '#{identifier}'")
end

# Messages always have a date as part of the filename, normally in YYYY.DD.MM format
def select_messages
  @items.select { |i| i.identifier =~ CONTENT_SELECTION }
end

# Messages always have a date as part of the filename, normally in YYYY.DD.MM format
def select_messages_from_current(limit = 25)
  sorted_articles(@items.select { |i| i.identifier =~ CONTENT_SELECTION and 
                                      i.path.to_s.start_with? @item.path.to_s }, limit)
end

def sorted_messages(limit = 25)
  sorted_articles(select_messages, limit)
end

# Select all by a regex matched against the category attribute
def sorted_articles_for_category(category_regex, limit = 100)
  return nil if category_regex.nil?
  # convert a String to a fully matching regex for backward compatibilty
  regex = category_regex.is_a?(String) ? /^#{category_regex}$/ : category_regex
  sorted_articles(@items.select { |i|
    i[:category] =~ regex and 
      (i[:created_at].is_a?(Time) ? i[:created_at] <= Time.now : true)
  }, limit)
end

# From: http://github.com/mgutz/nanoc3_blog/blob/master/lib/helpers.rb
#=> { 2010 => { 12 => [item0, item1], 3 => [item0, item2]}, 2009 => {12 => [...]}}
def articles_by_year_month(relevant_articles)
  result = {}
  current_year = current_month = year_h = month_a = nil

  sorted_articles(relevant_articles).each do |item|
    d = item[:created_at]
    d = d.is_a?(String) ? Date.parse(d) : d
    if current_year != d.year
      current_month = nil
      current_year = d.year
      year_h = result[current_year] = {}
    end

    if current_month != d.month
      current_month = d.month
      month_a = year_h[current_month] = [] 
    end

    month_a << item
  end

  result
end

# Multilingual support
# see http://nanoc.ws/docs/guides/creating-multilingual-sites/

# Determine if the item is the home page for a language by comparing
# the item identifier with the language code of the identifier.  If
# they are the same, the current item is the home page for that language.
def language_home_page?
  @item.identifier == '/' or @item.identifier[1..-2] == language_code_of(@item)
end

# Examine the item path and return the two letter language code.
# If there's no code, default to English (en).
# /studies/revelation/...    => en
# /zh/studies/revelation/... => zh
def language_code_of(item)
  (item.identifier.match(/^\/([a-z]{2})\//) || ['','en'])[1]
end

# Find all items that are translations of the current item
def translations_of(item)
  @items.select do |i| 
    #i[:canonical_identifier] == item[:canonical_identifier]
    canonical_identifier_of(i) &&
      canonical_identifier_of(i) == canonical_identifier_of(item)
  end #if canonical_identifier_of(item)
end

# Determine the canonical identifier of a given item by first 
# checking for the attribute and if not found, stripping off the
# two letter language code from the start of the identifier.
# /studies/revelation/...    => /studies/revelation/...
# /zh/studies/revelation/... => /studies/revelation/...
def canonical_identifier_of(item)
  item[:canonical_identifier] #|| item.identifier.sub(%r{^/[a-z]{2}/}, '/')
end
