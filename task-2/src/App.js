import React, {useState} from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  MenuItem,
} from "@mui/material";
import {styled} from "@mui/material/styles";

const StyledForm = styled("form")(({theme}) => ({
  padding: theme.spacing(3),
  maxWidth: "600px",
  margin: "0 auto",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({theme}) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({theme}) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
}));

const pumps = [
  {
    value: "1",
    label: "Trụ 1",
  },
  {
    value: "2",
    label: "Trụ 2",
  },
  {
    value: "3",
    label: "Trụ 3",
  },
  {
    value: "4",
    label: "Trụ 4",
  },
];

const App = () => {
  const [formData, setFormData] = useState({
    datetime: "",
    quantity: "",
    pumpNumber: "",
    revenue: "",
    pricePerUnit: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value || isNaN(value)) {
      if (["quantity", "revenue", "pricePerUnit"].includes(name)) {
        error = "Vui lòng nhập giá trị số";
      }
    }
    setErrors((prevErrors) => ({...prevErrors, [name]: error}));
  };

  const validateForm = () => {
    const formErrors = Object.keys(formData).reduce((acc, key) => {
      if (!formData[key] || errors[key]) {
        acc[key] = errors[key] || "Vui lòng nhập thông tin";
      }
      return acc;
    }, {});

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Thành công!");
        setFormData({
          datetime: "",
          quantity: "",
          pumpNumber: "",
          revenue: "",
          pricePerUnit: "",
        });
        setErrors({});
      }, 2000);
    } else {
      alert("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <StyledForm
      onSubmit={handleSubmit}
      noValidate
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <StyledButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </StyledButton>
      </Box>
      <Typography
        variant="h4"
        gutterBottom
      >
        Nhập giao dịch
      </Typography>
      <Grid
        item
        xs={12}
        md={6}
      >
        <TextField
          label="Thời gian"
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          InputLabelProps={{shrink: true}}
          fullWidth
          style={{marginBottom: 20}}
          error={!!errors.datetime}
          helperText={errors.datetime}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <StyledTextField
          fullWidth
          label="Số lượng"
          name="quantity"
          type="text"
          value={formData.quantity}
          onChange={handleChange}
          onInput={(e) => {
            const value = e.target.value;
            if (!/^\d*\.?\d*$/.test(value)) {
              e.target.value = value.slice(0, -1);
            }
          }}
          error={!!errors.quantity}
          helperText={errors.quantity}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <StyledTextField
          fullWidth
          label="Trụ"
          name="pumpNumber"
          select
          value={formData.pumpNumber}
          onChange={handleChange}
          error={!!errors.pumpNumber}
          helperText={errors.pumpNumber}
        >
          {pumps.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
      >
        <StyledTextField
          fullWidth
          label="Doanh thu"
          name="revenue"
          type="text"
          value={formData.revenue}
          onChange={handleChange}
          onInput={(e) => {
            const value = e.target.value;
            if (!/^\d*$/.test(value)) {
              e.target.value = value.slice(0, -1);
            }
          }}
          error={!!errors.revenue}
          helperText={errors.revenue}
        />
      </Grid>
      <Grid
        item
        xs={12}
      >
        <StyledTextField
          fullWidth
          label="Đơn giá"
          name="pricePerUnit"
          type="text"
          value={formData.pricePerUnit}
          onChange={handleChange}
          onInput={(e) => {
            const value = e.target.value;
            if (!/^\d*$/.test(value)) {
              e.target.value = value.slice(0, -1);
            }
          }}
          error={!!errors.pricePerUnit}
          helperText={errors.pricePerUnit}
        />
      </Grid>
    </StyledForm>
  );
};

export default App;

