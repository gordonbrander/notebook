# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
ENVIRONMENT = 'production';

if ENVIRONMENT == 'production'
  url = "http://gordonbrander.github.io/notebook"
else
  url = ''

asArray = (thing) ->
  """Box `thing` as an array unless already an array"""
  if (thing instanceof Array) then thing else if thing? then [thing] else []

items = (object) ->
  """For an object, get an array of 2-arrays containing key and value for every
  property of the object.
  Only considers own iterable properties."""
  keys = Object.keys(object)
  keys.map((key) -> [key, object[key]])

replaceStringViaPair = (string, pair) ->
  string.replace(pair[0], pair[1])

replaceAll = (strings, replacements) ->
  strings = asArray(strings)
  replacements = asArray(replacements)
  strings.map((string) -> replacements.reduce(replaceStringViaPair, string))

sortReverseChronological = (a, b) ->
  timestampA = new Date(a.date).valueOf()
  timestampB = new Date(b.date).valueOf()
  if timestampA < timestampB then 1 else if timestampA > timestampB then -1 else 0;

docpadConfig = {

  # =================================
  # Template Data
  # These are variables that will be accessible via our templates
  # To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

  templateData:

    # Specify some site properties
    site:
      # The production url of our website
      url: url

      # Here are some old site urls that you would like to redirect from
      oldUrls: [
      ]

      # The default title of our website
      title: "Gordon Brander's Notebook"

      # The website description (for SEO)
      description: """
        Notes and scribblings from the desk of Gordon Brander
        """

      # The website keywords (for SEO) separated by commas
      keywords: """
        ux, design, leanux, prototyping, javascript, engineering, front-end development, mobile
        """

      # The website's styles
      styles: [
        url + '/vendor/normalize.css'
      ]

      # The website's scripts
      scripts: [
      ]


    # -----------------------------
    # Helper Functions

    # Get the prepared site/document title
    # Often we would like to specify particular formatting to our page's title
    # we can apply that formatting here
    getPreparedTitle: ->
      # if we have a document title, then we should use that and suffix the site's title onto it
      if @document.title
        "#{@document.title} | #{@site.title}"
      # if our document does not have it's own title, then we should just use the site's title
      else
        @site.title

    # Get the prepared site/document description
    getPreparedDescription: ->
      # if we have a document description, then we should use that, otherwise use the site's description
      @document.description or @site.description

    # Get the prepared site/document keywords
    getPreparedKeywords: ->
      # Merge the document keywords with the site keywords
      @site.keywords.concat(@document.keywords or []).join(', ')

    getDocumentsMatchingUrl: (matching, excluding, sortBy) ->
      # Get all documents from the posts directory
      documents = @getCollection('documents').toJSON().filter((document) ->
        url = document.url
        matches = url.search(matching) isnt -1
        isMatch = if matching and excluding then matches and (url.search(excluding) is -1) else matches
      )
      documents.sort(if sortBy? then sortBy else sortReverseChronological)

    classname: (classnamestrings...) ->
      classesReducer = (accumulated, classname) ->
        accumulated = if typeof classname is 'string' then accumulated.concat(classname.trim().split(' ')) else accumulated
      classnamestrings.reduce(classesReducer, []).join(' ')

    replaceAll: replaceAll

  # =================================
  # DocPad Events

  # Here we can define handlers for events that DocPad fires
  # You can find a full listing of events on the DocPad Wiki
  events:

    # Server Extend
    # Used to add our own custom routes to the server before the docpad routes are added
    serverExtend: (opts) ->
      # Extract the server from the options
      {server} = opts
      docpad = @docpad

      # As we are now running in an event,
      # ensure we are using the latest copy of the docpad configuraiton
      # and fetch our urls from it
      latestConfig = docpad.getConfig()
      oldUrls = latestConfig.templateData.site.oldUrls or []
      newUrl = latestConfig.templateData.site.url

      # Redirect any requests accessing one of our sites oldUrls to the new site url
      server.use (req,res,next) ->
        if req.headers.host in oldUrls
          res.redirect(newUrl+req.url, 301)
        else
          next()
}

# Export our DocPad Configuration
module.exports = docpadConfig

