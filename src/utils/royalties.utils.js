export const sortAccountingRowsByRevenue = (rowA, rowB) => {
  return (rowA.revenuesEUR + rowA.revenuesUSD) > (rowB.revenuesEUR + rowB.revenuesUSD)
    ? -1 : 1
}

export const sortAccountingRowsByMonthDesc = (rowA, rowB) => {
  return rowA.reportedMonth > rowB.reportedMonth ? -1 : 1
}

const chooseSorter = (orderField, order) => {
  if (orderField === "reportedMonth" && order === "desc") return sortAccountingRowsByMonthDesc;
  if (orderField === "revenues" && order === "desc") return sortAccountingRowsByRevenue;
  return sortAccountingRowsByRevenue;
}

export const sortAccountingRows = (accRows, orderByProp) => {
  return accRows.sort(chooseSorter(orderByProp.field, orderByProp.order));
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

export const reduceGroupByField = (groupByField, valueToShow) => {
  if (groupByField === 'dsp') return dspReducer(valueToShow);
  if (groupByField === 'reportedMonth') return valueToShow.slice(0,7);
  return valueToShow;
}

export const sumEqualDSPNames = (accRows, groupBy) => {
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
  let putAllItunesAsDownloads = uniquesDsps.map(uniqueAcc => uniqueAcc.dsp === "iTunes" ? {
    ...uniqueAcc, downloads: uniqueAcc.streams + uniqueAcc.downloads, streams: 0
  } : uniqueAcc)
  return putAllItunesAsDownloads.filter(accFinalRow => accFinalRow.streams > 0 || accFinalRow.downloads > 0);
}

export const getAccDocId = (userIsAdmin, groupBy, field, values) => {
  if (userIsAdmin) return `accounting-all-${groupBy}`;
}