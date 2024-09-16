using {bookstore} from '../../../db/schema';

@path: 'service/payment'
service PaymentService {
    entity Payments as projection on bookstore.Payments
        actions {
            action startPaymentProcess() returns String;
        };


}
