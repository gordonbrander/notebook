# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
ENVIRONMENT = 'production';

if ENVIRONMENT == 'local'
  url = "http://gordonbrander.github.io/notebook"
else
  url = ''

prependAll = (strings, prepend) ->
  if strings? then strings.map((string) -> prepend + string) else []

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

    getDocumentsMatchingUrl: (matching, excluding) ->
      # Get all documents from the posts directory
      @getCollection('documents').toJSON().filter((document) ->
        url = document.url
        matches = url.search(matching) isnt -1
        isMatch = if matching and excluding then matches and (url.search(excluding) is -1) else matches
      ).sort((a, b) ->
        if a.order > b.order then 1 else if b.order > a.order then -1 else 0
      )

    classname: (classnamestrings...) ->
      classesReducer = (accumulated, classname) ->
        accumulated = if typeof classname is 'string' then accumulated.concat(classname.trim().split(' ')) else accumulated
      classnamestrings.reduce(classesReducer, []).join(' ')

    prependAll: prependAll

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

