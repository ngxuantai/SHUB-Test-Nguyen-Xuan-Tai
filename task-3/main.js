const axios = require("axios");

const inputUrl = "https://test-share.shub.edu.vn/api/intern-test/input";
const outputUrl = "https://test-share.shub.edu.vn/api/intern-test/output";

async function fetchInputData() {
  try {
    const response = await axios.get(inputUrl);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API:", error);
    throw error;
  }
}

function computePrefixSums(data) {
  const n = data.length;

  const prefixSum = new Array(n + 1).fill(0);
  const alternatePrefix = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + data[i];
    if (i % 2 === 0) {
      alternatePrefix[i + 1] = alternatePrefix[i] + data[i];
    } else {
      alternatePrefix[i + 1] = alternatePrefix[i] - data[i];
    }
  }

  return {prefixSum, alternatePrefix};
}

function processQueries(queries, {prefixSum, alternatePrefix}) {
  return queries.map((query) => {
    const qType = query.type;
    const [l, r] = query.range;

    if (qType === "1") {
      return prefixSum[r + 1] - prefixSum[l];
    } else if (qType === "2") {
      return alternatePrefix[r + 1] - alternatePrefix[l];
    }
  });
}

async function sendResults(token, results) {
  try {
    const payload = {results};

    const response = await axios.post(outputUrl, results, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Kết quả đã được gửi thành công!");
    } else {
      console.error(`Lỗi: ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Lỗi khi gửi dữ liệu:",
      error.response ? error.response.data : error.message
    );
  }
}

async function main() {
  try {
    const dataInput = await fetchInputData();
    const {token, data, query: queries} = dataInput;

    const prefixSums = computePrefixSums(data);

    const results = processQueries(queries, prefixSums);

    await sendResults(token, results);
  } catch (error) {
    console.error("Có lỗi xảy ra trong quá trình xử lý:", error);
  }
}

main();
