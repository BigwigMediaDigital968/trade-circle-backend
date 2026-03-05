import axios from "axios";

const OTP_BASE_URL = "http://sms.dovesofttech.io";

export const sendSmsOtp = async (phone) => {
  try {
    const response = await axios.post(
      `${OTP_BASE_URL}/generateOtp.jsp`,
      null,
      {
        params: {
          userid: process.env.OTP_USER_ID,
          key: process.env.OTP_API_KEY,
          mobileno: phone,
          timeoalive: 600, // 10 minutes
          message: "Your One Time Password is: {otp} Thank You",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};

export const verifySmsOtp = async (phone, otp) => {
  try {
    const response = await axios.post(
      `${OTP_BASE_URL}/validateOtpApi.jsp`,
      null,
      {
        params: {
          mobileno: phone,
          otp: otp,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("OTP verification failed");
  }
};