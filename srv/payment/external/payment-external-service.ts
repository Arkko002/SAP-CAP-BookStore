import { Currency } from "#cds-models/sap/common";
import stripe, { Stripe } from "stripe";

// TODO: Handle post-payment event and update Payment entity accordingly: https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=elements#web-post-payment
export interface IPaymentExternalService {}

// TODO: client-side PayementElement integration
// TODO: Saving card info needs to be GPDR compliant / other law compliant
// TODO Saving card info needs to be opt-in and stored as preference on user
// TODO Terms need to have dets about saving cards, whatev
export class PaymentExternalService implements IPaymentExternalService {
  private stripeAPI: Stripe;

  public constructor() {
    this.stripeAPI = new Stripe(process.env.STRIPE_API_KEY!);
  }

  // TODO: Price abstraction instead of number
  // TODO: Boundry around return value, dont tie stripe's client_secret into contract of this service
  public async startPaymentProcess(
    orderId: number,
    price: number,
    currency: Currency,
    newCustomer?: stripe.Customer,
  ): Promise<PaymentCreationResult> {
    const paymentIntent = newCustomer
      ? await this.stripeAPI.paymentIntents.create({
          customer: `${newCustomer.id!}`,
          amount: price,
          currency: currency.code,
          setup_future_usage: "off_session",
          automatic_payment_methods: {
            enabled: true,
          },
        })
      : await this.stripeAPI.paymentIntents.create({
          amount: price,
          currency: currency.code,
          automatic_payment_methods: {
            enabled: true,
          },
        });

    return { clientSecret: paymentIntent.client_secret };
  }

  // TODO: Return url
  // TODO: Test this: https://docs.stripe.com/payments/save-during-payment?platform=web&ui=elements#web-test-the-integration
  public async startOffSessionPaymentProcess(
    orderId: number,
    price: number,
    currency: Currency,
    customer: stripe.Customer,
  ): Promise<void> {
    const paymentMethod = await this.getCustomerPaymentMethods(customer.id);
    const paymentIntent = await this.stripeAPI.paymentIntents.create({
      amount: price,
      currency: currency.code,
      customer: `${customer.id}`,
      payment_method: `${paymentMethod.id}`,
      return_url: ``,
      off_session: true,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  public async saveCustomerDetails(
    details?: CustomerDetails,
  ): Promise<stripe.Customer> {
    return await this.stripeAPI.customers.create(details);
  }

  // TODO: Proper query support: https://docs.stripe.com/search#search-query-language
  public async getCustomerDetails(
    details: CustomerDetails,
  ): Promise<stripe.Customer> {
    const customersResult = await this.stripeAPI.customers.search({
      query: `name:\'${details.name}\'`,
    });

    if (!customersResult.data.length) {
      // TODO: error
    }

    return customersResult.data[0];
  }

  // TODO: Finish quering
  public async getCustomerPaymentMethods(
    customerId: string,
  ): Promise<stripe.PaymentMethod> {
    const paymentMethodsResult = await this.stripeAPI.paymentMethods.list({
      customer: `${customerId}`,
      type: "card",
    });

    if (!paymentMethodsResult.data.length) {
      // TODO: error
    }

    return paymentMethodsResult.data[0];
  }
}

export interface PaymentCreationResult {
  clientSecret: string;
}

export interface CustomerDetails {
  name?: string;
  email?: string;
}

