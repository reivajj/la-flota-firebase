export const sortAccountingRows = (rowA, rowB) => {
  return (rowA.revenuesEUR + rowA.revenuesUSD) > (rowB.revenuesEUR + rowB.revenuesUSD)
    ? -1 : 1
}

export const dspReducer = dspString => {
  let dspObject = {
    'Amazon Unlimited': 'Amazon',
    'Amazon Prime': 'Amazon',
    'Netease Cloud Music': 'Netease',
    'Facebook Fingerprinting': 'Facebook',
    'Facebook Audio Library': 'Instagram',
    'Youtube Ad Supported': 'Youtube Ad',
    'iHeart Radio US': 'iHeartRadio',
    'iTunes Match': 'iTunes',
    'YouTube': 'YouTube Music',
    'YouTube Red': 'YouTube Music',
    'Google Music (DK)': 'Google Music',
  }
  return dspObject[dspString] || dspString;
}

export const sumEqualDSPNames = (accRows, groupBy) => {
  console.log("GROUP BY: ", groupBy);
  if (groupBy.id !== "dsp") return accRows;
  let uniquesDsps = [...new Set(accRows.map(accRow => dspReducer(accRow.dsp)))];
  uniquesDsps = uniquesDsps.map(uniqueDsp => {
    let allDspRows = accRows.filter(accRow => dspReducer(accRow.dsp) === uniqueDsp);
    let dspAccFinal = { dsp: uniqueDsp, streams: 0, downloads: 0, revenuesEUR: 0, revenuesUSD: 0 };
    allDspRows.forEach(dspRow => {
      dspAccFinal.streams += dspRow.streams;
      dspAccFinal.downloads += dspRow.downloads;
      dspAccFinal.revenuesEUR += dspRow.revenuesEUR;
      dspAccFinal.revenuesUSD += dspRow.revenuesUSD;
    })
    return dspAccFinal;
  })
  console.log("DSPS ROWS: ", uniquesDsps);
  let putAllItunesAsDownloads = uniquesDsps.map(uniqueAcc => uniqueAcc.dsp === "iTunes" ? {
    ...uniqueAcc, downloads: uniqueAcc.streams + uniqueAcc.downloads, streams: 0
  } : uniqueAcc)
  return putAllItunesAsDownloads.filter(accFinalRow => accFinalRow.streams > 0 || accFinalRow.downloads > 0);
}

export const getAccDocId = (userIsAdmin, groupBy, field, values) => {
  if (userIsAdmin) return `accounting-all-${groupBy}`;
}