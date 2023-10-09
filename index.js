"use strict";

require("dotenv").config();
const axios = require("axios");
const { v4 } = require("uuid");

const madApiV3 = axios.create({
  baseURL: process.env.MADAPI_BASE_URL_V3,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.MADAPI_CONSUMER_KEY,
  },
});

const madApiV1 = axios.create({
  baseURL: process.env.MADAPI_BASE_URL_V1,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.MADAPI_CONSUMER_KEY,
  },
});

module.exports = {
  v1: {
    createUssdSubscription: async (serviceCode, callbackUrl, targetSystem) => {
      try {
        const response = await madApiV1.post("/messages/ussd/subscription", {
          serviceCode,
          callbackUrl,
          targetSystem,
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }
    },
  },
  v2: {},
  v3: {
    sendSms: async (
      senderAddress,
      message,
      receiverAddress,
      serviceCode,
      keyword,
      requestDeliveryReceipt = false
    ) => {
      try {
        payload = {
          senderAddress,
          receiverAddress,
          message,
          clientCorrelator: v4(),
          keyword,
          serviceCode,
          requestDeliveryReceipt,
        };
        const response = await madAxios3.post(
          "/messages/sms/outbound",
          payload
        );

        return response.data;
      } catch (error) {
        return { error: error.message };
      }
    },
    updateSubscription: async (
      subscriptionId,
      serviceCode,
      callbackUrl,
      targetSystem,
      dlrUrl,
      keywords
    ) => {
      try {
        const response = await madApiV3.patch(
          `/messages/sms/subscription/${subscriptionId}`,
          {
            subscriptionId,
            serviceCode,
            callbackUrl,
            targetSystem,
            dlrUrl,
            keywords,
          }
        );

        return response.data;
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }
    },
    createSmsSubscription: async (
      serviceCode,
      callbackUrl,
      targetSystem,
      dlrUrl
    ) => {
      try {
        const response = await madApiV3.post("/messages/sms/subscription", {
          serviceCode,
          callbackUrl,
          targetSystem,
          dlrUrl,
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }
    },
    deleteSubscription: async (subscriptionId) => {
      try {
        const response = await madApiV3.delete(
          `/messages/sms/subscription/${subscriptionId}`
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        return { error: error.message };
      }
    },
  },
};
