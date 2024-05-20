"use strict";

require("dotenv").config();
const axios = require("axios");
const { v4 } = require("uuid");

const madApiV3 = axios.create({
  baseURL: `${process.env.MADAPI_BASE_URL}/v3`,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.MADAPI_CONSUMER_KEY,
  },
});

const madApiV2 = axios.create({
  baseURL: `${process.env.MADAPI_BASE_URL}/v2`,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.MADAPI_CONSUMER_KEY,
  },
});

const madApiV1 = axios.create({
  baseURL: `${process.env.MADAPI_BASE_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.MADAPI_CONSUMER_KEY,
  },
});

function generateTransactionId() {
  const date = new Date();
  return Date.parse(date);
}

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
  v2: {
    /**
     *
     * @param {string} customerId - MSISDN for which service is to be activated
     * @param {string} nodeId - Service node (CP Name) configured for partner for which request is coming to System.
     * @param {string} transactionId - Unique Transaction ID originated from Service Requester Node. The ID is to be generated by the API user and will serve as the correlation id in Callbacks.
     * @param {string} subscriptionId - ID w.r.t Activation request. This is the serviceId
     * @param {string} subscriptionDescription - Service Plan ID for which subscription is to be done. Service ID is generated at DSDP end after service creation.
     * @param {string} subscriptionProviderId
     */
    subscribeUser: async (
      customerId,
      nodeId,
      subscriptionId,
      subscriptionDescription,
      subscriptionProviderId = "CSM",
      registrationChannel = "SMS",
      transactionId = generateTransactionId()
    ) => {
      try {
        const response = await madApiV2.post(
          `/customers/${customerId}/subscriptions`,
          {
            nodeId,
            subscriptionId,
            subscriptionDescription,
            subscriptionProviderId,
            registrationChannel,
            "auto-renew": true
          },
          {
            headers: {
              transactionId,
            },
          }
        );
        return { data: response.data };
      } catch (error) {
        return { error: error.message };
      }
    },

    /**
     *
     * @param {string} customerId - MSISDN for which service is to be activated
     * @param {string} nodeId - Service node (CP Name) configured for partner for which request is coming to System.
     * @param {string} transactionId - Unique Transaction ID originated from Service Requester Node. The ID is to be generated by the API user and will serve as the correlation id in Callbacks.
     * @param {string} subscriptionId - ID w.r.t Activation request. This is the serviceId
     * @param {string} subscriptionDescription - Service Plan ID for which subscription is to be done. Service ID is generated at DSDP end after service creation.
     * @param {string} subscriptionProviderId
     */
    unsubscribeUser: async (
      customerId,
      nodeId,
      description,
      subscriptionId,
      subscriptionProviderId = "CSM",
      transactionId = generateTransactionId()
    ) => {
      try {
        const response = await madApiV2.delete(
          `/customers/${customerId}/subscriptions/${subscriptionId}`,
          {
            params: {
              nodeId,
              description,
              subscriptionProviderId,
            },
            headers: {
              transactionId,
            },
          }
        );
        return { data: response.data };
      } catch (error) {
        return { error: error.message };
      }
    },

    queryProfile: async (
      customerId,
      nodeId,
      correlationId,
      subscriptionName,
      subscriptionId
    ) => {},

    subscriptionHistory: async (
      customerId,
      nodeId,
      transactionId,
      startDate,
      endDate
    ) => {},

    switchRenewMode: async (
      customerId,
      nodeId,
      correlationId,
      subscriptionName,
      subscriptionId,
      registrationChannel,
      subscriptionType,
      subscriptionDescription
    ) => {},
  },
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
        const payload = {
          senderAddress,
          receiverAddress,
          message,
          clientCorrelator: v4(),
          keyword,
          serviceCode,
          requestDeliveryReceipt,
        };
        const response = await madApiV3.post("/messages/sms/outbound", payload);
        console.log(response.data);

        return response.data;
      } catch (error) {
        console.log(error);
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
      deliveryReportUrl
    ) => {
      try {
        const response = await madApiV3.post("/messages/sms/subscription", {
          serviceCode,
          callbackUrl,
          targetSystem,
          deliveryReportUrl,
        });
        return { data: response.data };
      } catch (error) {
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
