import React, {useState} from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {FaFileExcel, FaUpload} from "react-icons/fa";
import * as XLSX from "xlsx";

const UploadArea = styled(Paper)(({theme}) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const App = () => {
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile && uploadedFile.name.endsWith(".xlsx")) {
      setFile(uploadedFile);
      setSuccess("Upload file thành công");
    } else {
      setError("Hãy upload file đúng định dạng (.xlsx)");
    }
  };

  const processFile = async () => {
    if (!file) {
      setError("Hãy upload file trước khi xử lý");
      return;
    }

    if (!startTime || !endTime) {
      setError("Nhập thời gian bắt đầu và kết thúc");
      return;
    }

    setLoading(true);
    setError("");
    setTotalAmount(null);

    try {
      const data = await readExcelFile(file);
      const filteredData = filterDataByTimeRange(
        processExcelData(data),
        startTime,
        endTime
      );
      const total = calculateTotalAmount(filteredData);
      setTotalAmount(total);
      setSuccess("Tính toán thành công");
    } catch (err) {
      setError("Quá trình tính toán bị lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: "array"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const processExcelData = (data) => {
    const transactionData = data.slice(5);
    const formattedData = transactionData.map((row) => ({
      STT: row["CHI TIẾT DOANH THU"],
      Date: row["__EMPTY"],
      Time: row["__EMPTY_1"],
      Station: row["__EMPTY_2"],
      Pump: row["__EMPTY_3"],
      Amount: parseFloat(row["__EMPTY_7"] || 0),
    }));

    return formattedData;
  };

  const parseDate = (dateString, timeString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const filterDataByTimeRange = (data, start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return data.filter(({Date, Time}) => {
      const rowDate = parseDate(Date, Time);
      return rowDate >= startDate && rowDate <= endDate;
    });
  };

  const calculateTotalAmount = (data) => {
    return data.reduce((total, row) => total + (row.Amount || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{maxWidth: 600, margin: "auto", p: 3}}>
      <Typography
        variant="h4"
        gutterBottom
        centered
      >
        Xử lý báo cáo doanh thu
      </Typography>

      <UploadArea
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        elevation={3}
        sx={{mb: 3}}
      >
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          style={{display: "none"}}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<FaUpload />}
            sx={{mb: 2}}
          >
            Upload Excel File
          </Button>
        </label>
        <Typography>hoặc kéo thả file đến đây</Typography>
        {file && (
          <Typography
            variant="body2"
            sx={{mt: 2}}
          >
            <FaFileExcel /> {file.name}
          </Typography>
        )}
      </UploadArea>

      <Grid
        container
        spacing={2}
        sx={{mb: 3}}
      >
        <Grid
          item
          xs={6}
        >
          <TextField
            label="Ngày bắt đầu"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{shrink: true}}
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            label="Ngày kết thúc"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{shrink: true}}
            fullWidth
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        onClick={processFile}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
        fullWidth
      >
        {loading ? "Đang tính toán..." : "Tính toán"}
      </Button>

      {totalAmount !== null && (
        <Typography
          variant="h5"
          sx={{mt: 3}}
        >
          Tổng tiền: {formatCurrency(totalAmount)}
        </Typography>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
      >
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;

