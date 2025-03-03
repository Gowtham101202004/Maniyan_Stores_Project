const Order = require('../../Models/orderModel');
const stripe = require('../../stripe');

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

async function getlineItems(lineItems) {
    let ProductItems = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await stripe.products.retrieve(item.price.product);
            const productId = product.metadata.productId;

            const productData = {
                productId: productId,
                name: product.name,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                image: product.images,
            };
            ProductItems.push(productData);
        }
    }

    return ProductItems;
}

const webhooks = async (request, response) => {
    const signature = request.headers['stripe-signature'];
    const rawBody = request.body;

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            const productDetails = await getlineItems(lineItems);

            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_email,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status,
                },
                shipping_options: session.shipping_options,
                totalAmount: session.amount_total / 100,
            };

            const order = new Order(orderDetails);
            await order.save();

            console.log(`✅ PaymentIntent for ${session.amount_total / 100} was successfull!`);
            break;
        case 'payment_method.attached':
            console.log(event.data.object);
            break;
        default:
            console.log(`⚠️ Unhandled event type ${event.type}.`);
    }

    response.status(200).send();
};

module.exports = { webhooks };