var express = require('express');
var router = express.Router();
const path = require('path');
require('dotenv').config();
const { createReport } = require('docx-templates');
const fs = require('fs');
const { checkJWT } = require('../middlewares/security');
const axios = require('axios');

const getImgRoute = (report) => {
  let pins =
    'pin-l+f82b07(' +
    report.from.point.lon +
    ',' +
    report.from.point.lat +
    '),pin-s+f82b07(' +
    report.to.point.lon +
    ',' +
    report.to.point.lat +
    ')';

  if (report.waypoints) {
    report.waypoints.forEach((city) => {
      pins += ',pin-s+f82b07(' + city.point.lon + ',' + city.point.lat + ')';
    });
  }

  const result =
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/' +
    pins +
    '/auto/900x900?access_token=' +
    process.env.MAPBOX_API;

  return result;
};

const postReport = async ({ body }, res) => {
  try {
    let dataSet = body;
    const img = await axios.get(getImgRoute(body.report), {
      responseType: 'arraybuffer'
    });
    dataSet.report.img = {
      data: Buffer.from(img.data).toString('base64'),
      width: 12,
      height: 12,
      extension: '.png'
    };

    const template = await fs.readFileSync(
      path.join('templates', 'report.docx')
    );
    let report;
    if (body.report.waypoints) {
      report = await createReport({
        template,
        cmdDelimiter: ['{{', '}}'],
        data: { ...dataSet }
      });
    } else {
      report = await createReport({
        template,
        cmdDelimiter: ['{{', '}}'],
        data: { ...dataSet, waypoints: [] }
      });
    }

    const data = [];
    fs.writeFileSync(path.join('temp', 'temp.docx'), report);

    fs.createReadStream(path.join('temp', 'temp.docx'))
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', () => {
        const buffer = Buffer.concat(data);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${body.report.user.last_name}.docx`
        );
        res.status(200).json(buffer);
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

router.post('/generate', checkJWT, postReport); // have to add  => checkJWT,

module.exports = router;
