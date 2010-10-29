# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.
require "bundler/setup"

def base_url
  @site.config[:base_url]
end

def css_url
  @site.config[:css_url]
end

def images_url
  @site.config[:images_url]
end

def home_page?
    @item.identifier == '/'
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

def sorted_articles(relevant_articles, limit = 25)
  require 'time'
  sorted_relevant_articles = relevant_articles.sort_by do |a|
    time = a[:created_at] || a[:date]
    time.is_a?(String) ? Time.parse(time) : time
  end.reverse.first(limit)
end

# Messages always have a date as part of the filename, normally in YYYY.DD.MM format
def select_messages
  @items.select { |i| i.identifier =~ %r{\d\d\d\d[.-]\d\d[.-]\d\d} }
end

def sorted_messages(limit = 25)
  sorted_articles(select_messages, limit)
end

def sorted_messages_for_event(event, limit = 25)
  sorted_articles(@items.select { |i| 
    i.identifier =~ %r{^/messages/\d\d\d\d/} and 
    i[:event] == event })
end

# From: http://github.com/mgutz/nanoc3_blog/blob/master/lib/helpers.rb
#=> { 2010 => { 12 => [item0, item1], 3 => [item0, item2]}, 2009 => {12 => [...]}}
def articles_by_year_month(relevant_articles)
  result = {}
  current_year = current_month = year_h = month_a = nil

  sorted_articles(relevant_articles).each do |item|
    d = item[:created_at] || item[:date]
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

