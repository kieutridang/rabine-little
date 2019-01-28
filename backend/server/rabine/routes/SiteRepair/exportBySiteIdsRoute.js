const Boom = require('boom');
const { Parser: Json2csvParser } = require('json2csv');
const { siteRepairValidation } = require('../../validations');
const { SiteRepairTemplate } = require('../../constants');

const exportBySiteIdsRoute = {
  method: 'GET',
  path: '/api/site/exportBySiteIds',
  config: {
    tags: ['api', 'repair', 'site'],
    description: 'Get repairs info by list of site ids',
    notes: 'Get repairs info by list of site ids',
    validate: {
      query: siteRepairValidation.repairExportBySiteIdsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteIds } = req.query;
      const { site } = req.server;

      return site.getByIds(siteIds)
        .then((sites) => {
          const siteInfo = sites.reduce((accumulator, current) => {
            const { _id, name } = current;
            return { ...accumulator, [_id]: name };
          }, {});

          return site.Repair.listRepairBySiteIds(siteIds)
            .then((repairs) => {
              if (repairs) {
                const fields = [...SiteRepairTemplate];
                const filename = 'site';
                const type = 'repair';

                const exportRepairs =
                  repairs.map(repair => ({ ...repair, siteName: siteInfo[repair.siteId] }));
                const json2csvParser = new Json2csvParser({ fields });
                const csv = json2csvParser.parse(exportRepairs);

                return reply(csv)
                    .header('Content-Type', 'application/octet-stream')
                    .header('Content-Disposition', `'attachment; filename=${filename}_${type}.csv`)
                    .code(200);
              }

              return reply(Boom.notFound());
            }).catch(err => reply(Boom.badRequest(err.message)));
        });
    }
  }
};

module.exports = exportBySiteIdsRoute;
