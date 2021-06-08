# Installing the Brightback JavaScript snippet

The brightback.js library is a JavaScript library for integrating Brightback into your site. Brightback’s JS Snippet enables:

1. Identification of the user and customer account
2. Personalization data for the exit experience
3. Segmentation of customers based on custom attributes
   (e.g. price, plan)
4. Redirection of canceling users to the Brightback exit experience

### Source links

The `brightback.js` file can be included from two different places. A version url and a non-version URL that is always updated to the most recent.

Current (recommended)

https://app.brightback.com/js/current/brightback.js?compiled=true

**IMPORTANT**: uncompiled versions do not include any polyfills and will not work in Internet Explorer.

## API

Brightback accepts precancel API calls made from either a client or a server. This allows flexibility to craft the request and execute the cancel request in a manner that fits one's product. Issue the request as a POST request with a serialized body and data in a JSON format.

All requests should be a `POST` with a body described below in the Fields area.

```
  POST https://app.brightback.com/precancel
```

## Fields

The following fields are required when making a request to the API. If your Application is using a billing integration for additional Brightback features, it will determine whether you have to include a `subscription_id` or not. If you are including a `subscription_id`, the `email` field is optional.

### REQUIRED

```javascript
{
  "app_id": "APP_ID",        // The app key of your Brightback application.
  // using a billing integation? include subscription_id
  "subscription_id": "[ID]",     // The id from your billing system
  // not using a billing integration? include email
  "email": 'jdoe@example.com',   // Your user's email address (where end user is your customer)
  "account": {
    "internal_id": "[ID]"        // Your customer's account ID
  }
}
```

### Optional

The following fields are optional, but should be used as they are below in order to map to Brightback's internal fields.

```javascript
{
  // after required items...
  "first_name": "John",                    //   First Name
  "last_name": "Doe",                      //   Last Name
  "full_name": "John Doe",                 //   Full Name
  "save_return_url": "https://site.com/account/",                // Return URL from Brightback for end-users who do not cancel
  "cancel_confirmation_url": "https://site.com/account/cancel",  // Return URL from Brightback for end-users who cancel
  "account": {
    // after required items...
    "company_name": "Acme Products",       // Display name of company for end-user facing content
    "company_domain": "acme.com",          // Used for display and data enrichment
    "billing_id": "cus_FfV4CXxpR8nAqB",    // Your user's billing ID used in your billing system
    "plan": "enterprise",                  // Plan type name used in your billing system
    "plan_term": "monthly",                // The frequency that the subscription is billed
    "created_at": 1312182000               // Timestamp of account created date
  },
  "custom": {                              // Used to add free-form additional fields
    "additional_fields": {                 // Nested fields are okay,
      "anything_else": "something"         // Arrays are not supported
    },
    "offer_accept_url": "https://site.com/account/discount?account_id=1234", // example offer accept url
    "offer_eligible": true                 // example key to determine eligibility for a specific customer
  },
  // Include this information for more detailed reporting and traffic routing
  "context": {
    "user_agent": "[navigator.userAgent]",     // Used to determine mobile routing in routing trees
    "locale": "[navigator.language]",
    "timezone": "[Intl.DateTimeFormat().resolvedOptions().timeZone]",
    "url": "[window.location.href]",
    "referrer": "[document.referrer]"
  }
}
```

One thing to note is the `context` section. If using our JS script, it will automatically be included.

Make sure to update the values of the specific fields with the appropriate information for your customer.

## Minimal example

The following is an example of the data that is strictly required for the integration to function properly. While some of the personalization and loss aversion would fall back to defaults, this would be a good place to start to get immediate value from an integration:

```html
<a id="bb-cancel" href="/fallback">Cancel</a>
<script
  type="text/javascript"
  src="https://app.brightback.com/js/current/?compiled=true"
></script>
<script type="text/javascript">
  if (window.Brightback) {
    window.Brightback.handleData({
      app_id: "APP_ID",
      email: "jdoe@example.com",
      account: {
        internal_id: "1234AZ55",
      },
    });
  }
</script>
```

Just replace the APP_ID, and populate the email of the user and internal_id of your customer's account, and you're ready to go!

## Full example

```html
<!-- Brightback | the customer retention company -->
<!-- * = required fields -->
<script
  type="text/javascript"
  src="https://app.brightback.com/js/current/brightback.js?compiled=true"
></script>
<script type="text/javascript">
  if (window.Brightback) {
    window.Brightback.handleData({
      app_id: "APP_ID", // * Identifies Brightback's customer and is provided by Brightback
      email: "jdoe@example.com", // * Email if not using `subscription_id`
      subscription_id: "[ID]", // * The id from your billing system
      first_name: "John", //   First Name
      last_name: "Doe", //   Last Name
      save_return_url: "https://site.com/account/", // * Return URL from Brightback for end-users who do not cancel
      cancel_confirmation_url: "https://site.com/account/cancel", // * Return URL from Brightback for end-users who cancel
      account: {
        internal_id: "1234AZ55", // * Your user's account ID (where end user is your customer)
        billing_id: "cus_FfV4CXxpR8nAqB", //   Your user's billing ID used in your billing system
        company_name: "Acme Products", // Display name of company for end-user facing content
        company_domain: "acme.com", //   Used for display and data enrichment
        plan: "enterprise", //   Plan type name used in your billing system
        value: 1000.0, //   Subscription revenue value (monthly or annual)
        created_at: 1312182000, //   Timestamp of account created date
      },
      custom: {
        activity: {
          emails: 42085, //   For loss aversion card
          templates: 86, //   Values populated via a back-end
          contacts: 102546, //
        },
      },
    });
  }
</script>
```

## How to use the code on the client

Paste the code right before the closing body tag of the page on which your cancel link appears.

Then, edit your code to include the end user, account and custom activity data of the currently logged in user.

Finally, you need to identify the button or link that is clicked by the user when initiating a cancelation request. You can do this by giving the cancel link or button in your app an id of `bb-cancel`. Brightback will replace the `href` if we are able to render an exit experience based on the provided data following the call to `window.Brightback.handleData`. You should maintain a fallback which conforms with your existing workflow in the case that Brightback is unable to render an exit experience.

```html
<button id="bb-cancel" href="/fallback">Cancel</button>
```

IMPORTANT: If you copied the code snippet above make sure to change your APP_ID to the value provided by Brightback.

## Single-page apps

If your app is characterized by asynchronous JS and few page refreshes, you may need to integrate Brightback in a slightly different way.

Include the Brightback JS library file in your HTML head element or however your framework (React, Angular, etc.) sets up the environment. This will bind a few functions to `window.Brightback`.

When your application is in a state where the user is presented with the cancelation option, you should setup the Brightback state, so that you can send the user immediately to the Brightback experience when the user clicks. This is achieved by sending the user's data to the `window.Brightback.handleDataPromise` method. For example:

```javascript
const p = window.Brightback.handleDataPromise({
  app_id: "APP_ID",
  first_name: "John",
  last_name: "Doe",
  email: "jdoe@example.com",
  save_return_url: "https://site.com/account",
  cancel_confirmation_url: "https://site.com/account/cancel",
  account: {
    company_name: "Acme Products",
    company_domain: "acme.com",
    internal_id: "1234AZ55",
    billing_id: "cus_FfV4CXxpR8nAqB",
    plan: "enterprise",
    value: 1000.0,
    created_at: 1312182000,
  },
  custom: {
    activity: {
      emails: 42054,
      templates: 81,
      contacts: 102444,
    },
  },
});
```

This will return a promise to a JSON validation object. The purpose of this step is to verify Brightback has sufficient data to render a cancelation experience prior to attempting to redirect the user. A successful validation object will look like this example:

```json
{
  "valid": true,
  "url": "https://app.brightback.com/examplecompany/cancel/LAz4pVyRkq"
}
```

When the user clicks on your cancel button, you could redirect them as in the following example:

```javascript
p.then((success) => {
  if (success.valid) {
    window.location.href = success.url;
  } else {
    //use your current cancelation flow
  }
});
```

## Using Segment with Brightback

```html
<script type="text/javascript">
  if (window.Brightback && window.analytics) {
    const Segment = analytics;
    const userId = Segment.user().id();
    const email = Segment.user().traits().email;
    const segmentData = {
      user: Segment.user().traits(),
      group: Segment.group() ? Segment.group().traits() : {},
    };
    window.Brightback.handleData({
      app_id: "APP_ID", // * Identifies Brightback's customer and is provided by Brightback
      email: email, // * Your user's email address (where end user is your customer)
      account: {
        internal_id: userId, // * Your user's account ID (where end user is your customer)
      },
      custom: {
        segment: segmentData, // Map your Segment data to fields in Brightback's integration field page
      },
    });
  }
</script>
```

## Example responses

Possible server responses

```javascript
// Status: 200
{ "valid": true, "message": "URL" }

// Status: 400
{ "valid": false, "message": "string" }

// Examples:
{ "valid": false, "message": "valid app_id is required" }
{ "valid": false, "message": "valid app_id, valid email, and account.internal_id are required." }
{ "valid": false, "message": "invalid json syntax" }

// Status: 404
{ "valid": false, message: "No such app:invalid_app_id" }
```
