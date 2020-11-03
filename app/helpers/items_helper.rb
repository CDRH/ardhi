module ItemsHelper
  include Orchid::ItemsHelper

  def map_selected_title
    if params["f"].present?
      f = params["f"]
      title = params["f"].select { |p| p.include?("title|") }.first
      if title
        title.split("|").last
      end
    end
  end

  def map_nav_class(nav_title, selected_title)
    if nav_title == selected_title ||
        (!selected_title && nav_title.nil?)
      "btn btn-primary"
    else
      "btn btn-default"
    end
  end

end
