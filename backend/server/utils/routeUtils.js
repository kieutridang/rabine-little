const supportMultipleRoute = (originRoutes) => {

  const routes = [].concat(originRoutes);

  return routes.reduce((collect, route) => {
    const paths = [].concat(route.path)
      .map(path => ({ ...route, path }));

    return collect.concat(paths);
  }, []);
};

module.exports = {
  multipleRoute: supportMultipleRoute
};
