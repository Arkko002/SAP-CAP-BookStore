using {OrdersService} from './order-service';

// TODO: Allowed auth users to view their own orders
annotate OrdersService with @requires: 'admin';
