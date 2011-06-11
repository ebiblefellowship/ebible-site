# Groups of items - tracks groups of items
# Same as a Hash except that when setting a value, certain optimizations
# are done.
#
# Usage:
# In Rules file:
#   preprocess do
#     # Returns ItemGroups instance.  Define method in the Nanoc3::Site instance.
#     def @site.item_groups
#       @item_groups = ItemGroups.new if @item_groups.nil?
#       @item_groups
#     end
#     ...
#     # select all items ...
#     @items.each do |i|
#       ...
#       # If part of a series, append item to an Array stored in a Hash by series name
#       @site.item_groups[i[:series]] = i if i[:series]
#     end
#   end
#
# TODO: consider subclassing Hash instead of using delegation
class ItemGroups

  def initialize
	@item_groups = {}
  end

  # Store the group name and associated value(s).  If the value is an Array,
  # it will replace any existing value.  Otherwise, the value will be saved
  # in a new Array or appended to an existing Array as a new value.
  def []=(name, value)
	if value.is_a?(Array)
	  @item_groups[name] = value
	elsif @item_groups.has_key?(name)
	  @item_groups[name] << value
	else
	  @item_groups[name] = [ value ]
	end
	@item_groups[name]
  end

  # Return all items in the specified group
  def [](name)
	@item_groups[name]
  end

  # All group names
  def names
	@item_groups.keys
  end

  # Size of groups
  def size
	@item_groups.size
  end
  alias :length :size

end
