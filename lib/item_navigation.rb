# Navigation helper for a group of items
class ItemNavigation
  attr_reader :curr_index, :prev_index, :next_index
  def initialize(item_group, current_item)
	@items = item_group
	# find index of the current item in the item_group
	@curr_index = @items.index(current_item)
	raise "item #{current_item.identifier} not found in item_group" if
	  @curr_index.nil?
	@prev_index = (@curr_index > 0) ? @curr_index - 1 : nil
	@next_index = (@curr_index <= (@items.size - 2)) ? @curr_index + 1 : nil
  end
  def has_prev?
	!@prev_index.nil?
  end
  def has_next?
	!@next_index.nil?
  end
  def prev
	has_prev? ? @items[@prev_index] : nil
  end
  def next
	has_next? ? @items[@next_index] : nil
  end
  def to_s
	"Current index: #{@curr_index}; Prev index: #{@prev_index}; Next index: #{@next_index}"
  end
end
