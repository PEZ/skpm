const extractRepository = require('./extract-repository')

module.exports = function getSkpmConfig(packageJSON) {
  const skpmConfig = packageJSON.skpm || {}
  return {
    main: skpmConfig.main || packageJSON.main,
    manifest: skpmConfig.manifest || packageJSON.manifest,
    version: skpmConfig.version || packageJSON.version,
    homepage: skpmConfig.homepage || packageJSON.homepage,
    description: skpmConfig.description || packageJSON.description,
    name: skpmConfig.name || packageJSON.name,
    title: skpmConfig.title || packageJSON.title,
    appcast: skpmConfig.appcast || packageJSON.appcast,
    resources: skpmConfig.resources || packageJSON.resources || [],
    babel: skpmConfig.babel || packageJSON.babel,
    repository: extractRepository(
      skpmConfig.repository || packageJSON.repository
    ),
    author: skpmConfig.author || packageJSON.author,
    test: skpmConfig.test || {},
  }
}
