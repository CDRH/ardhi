ItemsController.class_eval do

  def map
    @title = t "items.map.title"
    @preset_class = "map"

    # query to return only souvenir documents
    options = params.permit!.deep_dup
    options["fl"] = "identifier,title,spatial.coordinates,spatial.name"
    # TODO this may not be high enough but right now
    # there are only 6 documents so hopefully it's good for a while!
    options["num"] = 1000
    @res = @items_api.query(options)

    @json = create_geojson(@res.items)

    # second query for the document facets,
    # which assumes all docusements have unique titles,
    # to facilitate easier toggling
    # TODO this functionality will need internationalization
    # once we know the languages
    @facets = @items_api.query({"facet" => "title"}).facets

    # render search preset with route information
    @route_path = "map_path"
    render_overridable "items", "map"
  end

  private

  def create_geojson(items)
    features = []
    items.each do |item|
      if item["spatial"]
        item["spatial"].each do |spatial|
          features << {
            "type" => "Feature",
            "properties" => {
              "title" => spatial["name"],
              "document" => item["title"],
              "identifier" => item["identifier"]
            },
            "geometry" => {
              "type" => "Point",
              "coordinates" => [
                spatial["coordinates"][0],
                spatial["coordinates"][1]
              ]
            }
          }
        end
      end
    end
    collection = {
      "type" => "FeatureCollection",
      "features" => features
    }
    collection.to_json
  end

end
