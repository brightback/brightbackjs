# Installing the Brightback JavaScript snippet

The brightback.js library is a JavaScript library for integrating Brightback into your site. Brightback’s JS Snippet enables:

1. Identification of the user and customer account
2. Personalization data for the exit experience
3. Segmentation of customers based on custom attributes
(e.g. price, plan)
4. Redirection of canceling users to the Brightback exit experience

## Sample
```html
<!-- Brightback | the customer retention company -->
<!-- * = required fields -->
<script type="text/javascript" src="https://app.brightback.com/js/current/brightback.js"></script>
<script type="text/javascript">
  if (window.Brightback) {
    window.Brightback.handleData({
      app_id: 'APP_ID,                    // * Identifies Brightback's customer and is provided by Brightback
      first_name: 'John',                 //   First Name
      last_name: 'Doe',                   //   Last Name
      email: 'jdoe@example.com',          // * Admin email
      save_return_url:
      'https://site.com/account/',        // * Return URL from Brightback for end-users who do not cancel
      cancel_confirmation_url:
      'https://site.com/account/cancel',  // * Return URL from Brightback for end-users who cancel
      account: {
        company_name: 'Acme Products',    // * Display name of company for end-user facing content
        company_domain: 'acme.com',       //   Used for display and data enrichment
        internal_id: '1234AZ55',          // * Your user's account ID (where end user is your customer)
        billing_id: 'cus_FfV4CXxpR8nAqB', //   Your user's billing ID used in your billing system
        plan: 'enterprise',               //   Plan type name used in your billing system
        created_at: 1312182000            //   Timestamp of account created date
      },
      custom: {
        activity: {
          emails: 42085,                  //   For loss aversion card
          templates: 86,                  //   Values populated via a back-end
          contacts: 102546                //
        }
    });
  }
</script>
```

## How to use the code

Paste the code right before the closing body tag of the page on which your cancel link appears.

Then, edit your code to include the end user, account and custom activity data of the currently logged in user.

Finally, you need to identify the button or link that is clicked by the user when initiating a cancelation request. You can do this by giving the cancel link or button in your app an id of `bb-cancel`. Brightback will replace the `href` if we are able to render an exit experience based on the provided data following the call to `window.Brightback.handleData`. You should maintain a fallback which conforms with your existing workflow in the case that Brightback is unable to render an exit experience.

```html
<a id="bb-cancel" href="/fallback">Cancel</a>
```

IMPORTANT: If you copied the code snippet above make sure to change your APP_ID to the value provided by Brightback.

## Single-page apps

If your app is characterized by asynchronous JS and few page refreshes, you may need to integrate Brightback in a slightly different way.

Include the Brightback JS library file in your HTML head element or however your framework (React, Angular, etc.) sets up the environment. This will bind a few functions to `window.Brightback`.

When your application is in a state where the user is presented with the cancelation option, you should setup the Brightback state, so that you can send the user immediately to the Brightback experience when the user clicks. This is achieved by sending the user's data to the `window.Brightback.handleDataPromise` method. For example:
```javascript
const p = window.Brightback.handleDataPromise({
  app_id: 'APP_ID',
  first_name: 'John',
  last_name: 'Doe',
  email: 'jdoe@example.com',
  save_return_url: 'https://site.com/account',
  cancel_confirmation_url: 'https://site.com/account/cancel',
  account: {
    company_name: 'Acme Products',
    company_domain: 'acme.com',
    internal_id: '1234AZ55',
    billing_id: 'cus_FfV4CXxpR8nAqB',
    plan: 'enterprise',
    created_at: 1312182000
  },
  custom: {
    activity: {
      emails : 42054,
      templates : 81,
      contacts : 102444
    }
  }
});
```
This will return a promise to a JSON validation object. The purpose of this step is to verify Brightback has sufficient data to render a cancelation experience prior to attempting to redirect the user. A successful validation object will look like this example:
```
{
  "valid": true,
  "url": "https://app.brightback.com/examplecompany/cancel/LAz4pVyRkq"
}
```
When the user clicks on your cancel button, you could redirect them as in the following example:
```javascript
p.then((success) => {
  if (success.valid) {
    window.location.href = resp.url;
  } else {
    //use your current cancelation flow
  }
});
```

## Minimal example

The following is an example of the data that is strictly required for the integration to function properly. While some of the personalization and loss aversion would fall back to defaults, this would be a good place to start to get immediate value from an integration:
```html
<a id="bb-cancel" href="/fallback">Cancel</a>
<script type="text/javascript" src="https://app.brightback.com/js/current/brightback.js"></script>
<script type="text/javascript">
  if (window.Brightback) {
    window.Brightback.handleData({
    app_id: 'APP_ID',
    email: 'jdoe@example.com',
    account: {
      internal_id: '1234AZ55'
    }
  });
  }
</script>
```
Just replace the APP_ID, and populate the email of the user and internal_id of your customer's account, and you're ready to go!
