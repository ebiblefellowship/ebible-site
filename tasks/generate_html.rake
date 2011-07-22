# Tasks to generate HTML files based on audio metadata files.

# original by Denis Dufresne (http://gist.github.com/657855)

# Rule to create html page files if one doesn't exist based on the mp3 yaml file
rule %r{^#{CONTENT_ROOT}.*\.html$} => [
  proc { |tn| tn.sub(%r{^#{CONTENT_ROOT}}, META_ROOT).ext('yaml') }
] do |t|

  require 'yaml'

  # Don't overwrite already existing html file
  if File.exists?(t.name)
    #puts "    ... skipping ..."
    next
  end

  puts "*** creating html page #{t.name} (eventually)"

  yaml_meta = YAML.load_file(t.source)

  file_meta = parse_dated_file(File.basename(t.source, '.yaml'))

  # load yaml data to use title and speaker if they exist from the MP3 ID3 tags
  metadata = {
    'title' => yaml_meta['title'] || file_meta['title'],
    'speaker' => yaml_meta['speaker'] || file_meta['speaker'],
    'created_at' => file_meta['created_at'],
    'slug' => file_meta['slug'],
    'audio' => [ t.source.sub(%r{^#{META_ROOT.sub(%r{/audio$},'')}}, '') ]
  }

  # write out .html file
  FileUtils.mkdir_p(File.dirname(t.name))
  File.open(t.name, 'w') do |io|
    io.write(YAML.dump(metadata))
    io.puts("---")
  end
end

# parse filename and extract date, speaker and title returning a Hash
def parse_dated_file(file)
  require 'to_slug'
  String.send(:include, ToSlug)  # add to_slug method to String class
  meta = {}
  if file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_Fellowship_Hour}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = 'Chris McCann'
    meta['title'] = "Fellowship Hour for #{meta['created_at']}"
    meta['slug'] = 'fellowship-hour'
  elsif file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_(\w+)_-_(.+)}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = SPEAKERS[$2] || $2
    meta['title'] = $3.tr('_',' ')
    meta['slug'] = meta['title'].to_slug
    meta['title'] = meta['title'] + ' for ' + meta['created_at'] if meta['title'] =~ /Open Forum/
  elsif file =~ %r{^(\d\d\d\d\.\d\d\.\d\d)_-_(.+)}
    meta['created_at'] = $1.tr('.','-')
    meta['speaker'] = 'Chris McCann'
    meta['title'] = $2.tr('_',' ')
    meta['slug'] = meta['title'].to_slug
  end
  meta
end

namespace :generate do

  desc 'Generate HTML stubs for correspending audio metadata files'
  task :html, :dir do |t, args|
    args.with_defaults(:dir => '/**')
    glob = File.join(META_ROOT, args[:dir], '*.yaml')
    puts "** Generating HTML stubs for '#{glob}'"
    Dir[glob].each do |source|
      target = source.sub(%r{^#{META_ROOT}}, CONTENT_ROOT).ext('html')
      Rake::Task[target].invoke
    end
  end

end

