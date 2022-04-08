import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  I18nManager,
  TextInput,
} from 'react-native';
import {Icon, Input, Card} from 'react-native-elements';
import {Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import Header from '../../Components/Header';
import I18n from '../../Translations/i18';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Constants/config';
import WebView from 'react-native-webview';
import { connect } from "react-redux";

import axios from 'axios';
const privacyPolicies = [
  'Privacy Statement',

  'your privacy is important to us. You place your trust in us by using MyBoat services, and we value that trust. That means we&rsquo;re committed to protecting and safeguarding any personal data you give us. We act in our customers&#39; interest and are transparent about the processing of your personal data.',

  'This document describes how we use and process your personal data, provided in a readable and transparent manner. It also tells you what rights you can exercise in relation to your personal data (such as the right to object) and how to contact us. Please also read our Cookie Statement, which tells you how Booking.com uses cookies and other similar technologies.',

  'If you&rsquo;ve used us before, you know that MyBoat offers online boats-related services through our own websites and mobile apps, as well as other online platforms such as partners&rsquo; websites and social media. We&rsquo;d like to point out that all the info you&rsquo;re about to read generally applies to not one, not two, but all of these platforms.',

  'In fact, this single privacy statement applies to any kind of customer info we collect through all of the above platforms or by any other means connected to these platforms, such as when you contact our customer service team by email.',

  'If you&#39;re one of our business partners, check out our Privacy Statement for Business Partners to understand how personal data is further processed as part of the business relationship.',

  'We might amend the Privacy Statement from time to time, so we recommend revisiting this page occasionally to make sure you know where you stand. If we make changes to the Privacy Statement which will have an impact on you (e.g. if we intend to process your personal data for other purposes than previously communicated), we&#39;ll notify you of these changes before the new activities begin.',

  'And now, the sad but necessary part: If you disagree with this Privacy Statement, you should discontinue using our services. If you agree with our Privacy Statement, then you&rsquo;re all set to book your next trip through us.',

  'Terms we use in this Privacy Statement',
  '&ldquo;Trip&rdquo; refers to the various different travel products and services that can be ordered, acquired, purchased, bought, paid, rented, provided, reserved, combined, or consummated by you from the Trip Provider.',

  '&ldquo;Trip Provide&rdquo; refers to the provider of transportation provider (e.g. Boat rentals, cruises, boat tours, transfers), tour operators, and any other boat or related product or service as from time to time available for Trip Reservation on the platform.',

  '&ldquo;Trip Service&rdquo; refers to the online purchase, order, (facilitated) payment, or reservation service as offered or enabled by MyBoat in regards to various products and services as from time to time made available by Trip Providers on the platform.',

  '&ldquo;Trip Reservation&rdquo; refers to the order, purchase, payment, booking, or reservation of a Trip.',

  'What kind of personal data does MyBoat collect?',
  'We can&rsquo;t help you book the perfect Trip without information, so when you use our services there are certain things we ask for. This is typically routine info &ndash; your name, preferred contact details, the names of the people touring with you, and your payment info. You might also decide to submit additional info related to your upcoming Trip (e.g. your anticipated arrival time).',

  'In addition to this, we also collect info from the computer, phone, tablet, or other device you use to access our services. This includes the IP address, the browser used, and your language settings. There are also situations when we receive info about you from others or automatically collect other info.',

  'This is just a general overview. If you&rsquo;d like to learn more about the info we collect, we go into more detail below.',

  'Read more about the personal data we collect',

  'Why does MyBoat collect and use your personal data?',
  'The main reason we ask for personal details is to help you organize your online Trip Reservations and ensure you get the best possible service.',

  'We also use your personal data to contact you about the latest deals, special offers, and other products or services we think you might be interested in. There are other uses, too. If you&rsquo;d like to find out what they are, read on for a more detailed explanation.',

  'Read more about why MyBoat collects your data',

  'How does MyBoat share your data with third parties?',
  'There are different parties integrated into MyBoat services, in various ways and for various reasons. The primary reason we share your data is to provide the Trip Provider with the relevant info to complete your Trip Reservation.',

  'We also involve other parties to provide you MyBoat services. This includes, for example, financial institutions, advertisers, subsidiaries of the MyBoat corporate group. In some cases, if we&rsquo;re required by law, we might share your data with governmental or other authorities.',

  'We&rsquo;ll go into more detail about how the info you share with us is used and exchanged with these parties below. Read more',

  'Read more about how data is shared with future third parties',

  'How is your personal data shared within the MyBoat corporate ?',
  'MyBoat is part of the MyBoat corporate group. Read on to learn how your data may be shared within the MyBoat corporate group.',

  'Read more about data within MyBoat',

  'How is your personal data shared and further processed for ground transportation services?',
  'MyBoat and her future sub companies . group of companies&mdash;jointly use your data to offer you ground transport services via the MyBoat websites and apps (such as transportation booking). Read more to understand the scope and limited nature of our joint responsibility.',

  'Read more about data and our ground transportation services',

  'How does MyBoat process communications that you and your Trip Provider may send via MyBoat ?',
  'MyBoat can help you and Trip Providers exchange info or requests about services and existing Trip Reservations through the MyBoat platform. To find out more about how MyBoat receives and handles these communications, read on here.',

  'Read more about how these communications are processed',

  'How does MyBoat make use of mobile devices?',
  'We offer free apps that we also collect and process personal data through. This works in a similar way to our website, but they also allow you to benefit from the location services available on your mobile device(s).',

  'Read more about how we use data from mobile devices',

  'How does MyBoat make use of social media?',
  'The use of social media may be integrated into MyBoat services in various ways. These will involve us collecting some of your personal data, or the social media provider receiving some of your info. If you&rsquo;d like to learn more about how this info is used and exchanged, read on.',

  'Read more about how we use social media data',

  'What security and retention procedures does MyBoat put in place to safeguard your personal data?',
  'We&rsquo;ve implemented a range of procedures to prevent unauthorized access to and the misuse of personal data that we process.',

  'Read more about security and retention procedures',

  'How can you control the personal data you&rsquo;ve given to MyBoat ?',
  'You have the right to review the personal data we keep about you at any time. You can request access to or deletion of your personal data by submitting this form. If you want to find out more about your rights to control your personal data, read on.',

  'Read more about how you can control your personal data',

  'Who is responsible for the processing of personal data on the MyBoat website and apps?',
  'MyBoat located in , controls the processing of personal data for the provision of its services. That includes its websites and mobile apps, except for some exceptions that are clarified in this privacy statement.',

  'Read more about MyBoat responsibility for personal data',

  'What kind of personal data does MyBoat collect?',
  'Depending on the law that applies to you, we might be required to provide some additional info. If you&#39;d like to learn more, continue reading.',

  'Personal data you give to us.',
  'MyBoat collects and uses the info you provide us. When you make a Trip Reservation, you are (at a minimum) asked for your name and email address.',

  'Depending on the Trip Reservation, we might also ask for your home address, phone number, payment info, date of birth, the names of any guests booking with you, and any preferences (e.g. meal preferences, mobility restrictions) you have for your Trip.',

  'If you need to get in touch with our customer service team, contact your Trip Provider through us, or reach out to us in a different way (e.g. social media), we&rsquo;ll collect info from you there, too if applicable. This applies whether you&rsquo;re contacting us with feedback or asking for help using our services.',

  'You might also be invited to write reviews to help inform others about the experiences you had on your Trip. When you write a review on the MyBoat platform, we&rsquo;ll collect any info you&rsquo;ve included, along with your display name and avatar (if you choose one).',

  'There are other instances where you&rsquo;ll provide us with info, as well. For example, if you&rsquo;re browsing with your mobile device, you can decide to allow MyBoat to see your current location or grant us access to your contacts. This helps us give you the best possible service and experience by, for example, showing you our city guides, suggesting attractions close to your location, or making other recommendations.',

  'If you create a user account, we&rsquo;ll also store your personal settings, uploaded photos, and reviews of previous bookings. This saved data can be used to help you plan and manage future Trip Reservations or benefit from other features only available to account holders, such as incentives or other benefits.',

  'We may offer you referral programs or sweepstakes. Participating in these will involve providing us with relevant personal data.',

  'Personal data you give us about others.',
  'Of course, you might not just be making a Trip Reservation for yourself. You might be taking a Trip with other people or making a reservation on someone else&rsquo;s behalf. In both scenarios, you&rsquo;ll provide their details as part of the Trip Reservation.',

  'If you have a MyBoat for Business account, you can also keep an address book to make it easier to plan and manage business tour arrangements for others.',

  'In some cases, you might use MyBoat to share info with others. This can take the form of sharing a wish list or participating in a referral program, as described when you use the relevant feature.',

  'At this point, we have to make it clear that it&rsquo;s your responsibility to ensure that the person or people you provide personal data about are aware that you&rsquo;ve done so and that they&rsquo;ve understood and accepted how MyBoat uses their info (as described in this Privacy Statement).',

  'Personal data we collect automatically.',
  'Whether or not you end up making a Trip Reservation, when you visit our websites or apps, we automatically collect certain info. This includes your IP address, the date and time you accessed our services, the hardware, software, or internet browser you used, and info about your computer&rsquo;s operating system like application versions and your language settings. We also collect information about clicks and which pages were shown to you.',

  'If you&rsquo;re using a mobile device, we collect data that identifies the device, as well as data about your device-specific settings and characteristics, app crashes, and other system activity. When you make a Trip Reservation using this kind of device, our system registers how you made your reservation (on which website), and/or which site you came from when you entered the MyBoat website or app.',

  'Personal data we receive from other sources.',
  'It&rsquo;s not just the things you tell us, though &ndash; we may also receive info about you from other sources. These include business partners, such as car booking partners, subsidiaries of the MyBoat corporate group, and other independent third parties.',

  'Anything we receive from these partners may be combined with info provided by you. For example, MyBoat Trip Reservation services aren&rsquo;t only made available via MyBoat and the MyBoat apps, but are also integrated into services of tour partners you can find online. When you use any of these services, you provide the reservation details to our business partners who then forward your details to us.',

  'We also integrate with third party service providers to facilitate payments between you and Trip Providers. These service providers share payment information, so we can administer and handle your Trip Reservation, making sure everything goes as smoothly as possible for you.',

  'We also collect info when we receive a complaint about you from a Trip Provider (e.g. in the case of misconduct).',

  'Another way we might receive data about you is through the communication services integrated into our platforms. These communication services offer you a way to contact the Trip Provider you&rsquo;ve booked with to discuss your stay. In some cases, we receive metadata about these communication activities (e.g. who you are, where you called from, and the date and length of the call).',

  'We may also receive info about you in order to show you more relevant ads, such as the additional cookie data MyBoat social media partners make available to us. Please read the section Why does MyBoat collect and use your personal data? for more info.',

  'When you link your MyBoat user account to a social media account, you might exchange data between MyBoat and that social media provider. You can always choose not to share that data.',

  'Trip Providers may share info about you with MyBoat , too. This could happen if you have support questions about a pending Trip Reservation, or if disputes or other issues arise about a Trip Reservation.',

  'Why does MyBoat collect and use your personal data?',
  'We use the info collected about you for various purposes. Your personal data may be used in the following ways:',

  'Trip Reservations: First and foremost, we use your personal data to complete and administer your online Trip Reservation, which is essential for what we do. This includes sending you communications that relate to your Trip Reservation, such as confirmations, modifications, and reminders.',

  'Customer service: We provide international customer service from our local offices in 2 languages and are here to help 24/7. Sharing relevant details such as reservation info or info about your user account with our customer service staff allows us to respond when you need us and reached. This includes helping you to contact the right Trip Provider and responding to any questions you might have about your Trip Reservation (or any other questions, for that matter).',

  'Account facilities: MyBoat users can create an account on our website or apps. We use the info you give us to administer this account, enabling you to do a number of useful things. You can manage your Trip Reservations, take advantage of special offers, make future Trip Reservations easily, and manage your personal settings.',

  'Managing personal settings lets you keep and share lists, share photos, view previously searched Trip Services, and check other travel-related info you&#39;ve provided. You can also see any reviews you&rsquo;ve written.',

  'If you want, you can share certain info as part of your user account by creating a public profile under your own first name or a screen name you choose.',

  'If you&rsquo;re a MyBoat for Business account holder, you can also save contact details under that account, manage business reservations, and link other account holders to the same MyBoat for Business account.',

  'Online groups: We might give account holders the chance to connect and interact with each other through online groups or forums.',

  'Marketing activities: We use your information for marketing activities. These activities include:',

  'Using your contact info to send you regular news about tours-related products and services. You can close notification from setting regarding marketing communications quickly, easily, and anytime. All you need to do is click the &ldquo;close notification&rdquo; in setting or other communication.',

  'Based on your info, individualized offers might be shown to you on the MyBoat website, on mobile apps, or on third-party websites/apps (including social media sites), and the content of the site displayed to you might be personalized. These could be offers that you can book directly on the MyBoat website, on co-branded sites, or other third-party offers or products we think you might find interesting.',

  'When you participate in other promotional activities (e.g. sweepstakes, referral programs, or competitions), relevant info will be used to administer these promotions.',

  'Communicating with you: There might be other times when we get in touch, including by email, mail, phone, or text. Which method we choose depends on the contact info you previously shared.',

  'We process the communications you send to us. There could be a number of reasons for this, including:',

  'Responding to and handling any requests you or your booked Trip Provider have made. MyBoat also offers customers and Trip Providers various ways to exchange info, requests, and comments about Trip Providers and existing Trip Reservations via Booking.com. For more info, read the section titled &ldquo;How does MyBoat process communications that you and your booked Trip Provider may send through MyBoat ?.&rdquo;',

  'If you haven&#39;t finalized a Trip Reservation online, we can contact you with a reminder to continue with your reservation. We believe this additional service benefits you because it allows you to carry on with a Trip Reservation without having to search for Trip Providers or enter your reservation details again.',

  'When you use our services, we might send you a questionnaire or invite you to provide a review about your experience with Booking.com or the Trip Provider.',

  'We also send you other material related to your Trip Reservations, such as how to contact Booking.com if you need assistance while you&rsquo;re away, and information that we feel might be useful to you in planning or making the most of your Trip. We might also send you material related to upcoming Trip Reservations or a summary of previous Trip Reservations you made through Booking.com.',

  'Even if you don&rsquo;t have an upcoming Trip Reservation, we may still need to send you other administrative messages, which could include security alerts.',

  'Market research: We sometimes invite our customers to take part in market research. Review the info that accompanies this kind of invitation to understand what personal data will be collected and how it&rsquo;s used.',

  'Improving our services: We also use personal data for analytical purposes and product improvement. This is part of our commitment to improving our services and enhancing the user experience.',

  'In this case, we use data for testing and troubleshooting purposes, as well as generating statistics about our business. The main goal here is to get insights into how our services perform, how they&rsquo;re used, and ultimately to optimize and customize our website and apps, making them easier and more meaningful to use. We strive to use pseudonyms for this analytical work as much as possible.',

  'Customer reviews and other destination-related info: During and after your Trip, we might invite you to submit a review. We can also make it possible for the people you&rsquo;re traveling with or whom you booked a reservation for to do this instead. This invite asks for info about the Trip Provider or the destination.',

  'If you have a MyBoat account, you can choose to display a screen name next to your review instead of your real name ,or even submit the review anonymously. If you&rsquo;d like to set a screen name, you can do so in your account settings. Adding an avatar is also possible.',

  'By completing a review, you&rsquo;re agreeing that it can be displayed (as described in detail in our Terms and Conditions) on, for example, the relevant Trip Provider info page on our websites, on our mobile apps, on our social media accounts and social media apps, or on the online platform of the relevant Trip Provider or business partner&rsquo;s website. This is to inform other travelers about the quality of the Trip Service you used, the destination you have chosen, or any other experiences you choose to share.',

  'Call monitoring: When you make calls to our customer service team, MyBoat might be uses an automated telephone number detection system to match your telephone number to your existing reservations. This helps save time for both you and our customer service staff. However, our customer service staff may still ask for authentication, which helps to keep your reservation details confidential.',

  'During calls with our customer service team, live listening might be carried out or calls might be recorded for quality control and training purposes. This includes the use of the recordings for handling of complaints, legal claims, and fraud detection.',

  'Not all calls are recorded. Recordings are kept for a limited amount of time before being automatically deleted. An exception to this rule is when MyBoat has a legitimate need to keep the recordings longer for fraud investigation or legal purposes.',

  'Promotion of a safe and trustworthy service: To create a trustworthy environment for you, the people you bring with you on your Trip, MyBoat business partners, and our Trip Providers, we might use personal data to detect and prevent fraud and other illegal or unwanted activities.',

  'Similarly, we might use personal data for risk assessment and security purposes, including the authentication of users and reservations. When we do this we may have to stop or put certain Trip Reservations on hold until we finish our assessment.',

  'Legal purposes: Finally, in certain cases, we may need to use your info to handle and resolve legal disputes, for regulatory investigations and compliance to enforce the Booking.com online reservation service terms of use, or to comply with legal requests from law enforcement.',

  'Providing your personal data to MyBoat is voluntary. However, we may only be able to provide you with certain services if we can only collect some personal data. For example, we can&rsquo;t process your Trip Reservation if we don&rsquo;t collect your name and contact details.',

  'If we use automation to process personal data that produces legal effects or significantly affects you, we&rsquo;ll always implement the measures required to safeguard your rights and freedoms. This includes the right to obtain human intervention.',

  'To process your personal data as described above, we rely on the following legal bases:',
  'As applicable, for purpose A and B, MyBoat relies on the legal basis that the processing of personal data is necessary for the performance of a contract, specifically to finalize and administer your Trip Reservation.',

  'If the required personal data isn&rsquo;t provided, MyBoat can&rsquo;t finalize the Trip Reservation, nor can we provide customer service. In view of purposes C to L, MyBoat relies on its legitimate commercial business interest to provide its services, prevent fraud, and improve our services (as set out more specifically under C to L).',

  'When using personal data to serve MyBoat or a third party&#39;s legitimate interest, MyBoat will always balance your rights and interests in the protection of your personal data against MyBoat rights and interests or those of the third party. For purpose M, MyBoat also relies, where applicable, on compliance with legal obligations (such as legal law enforcement requests).',

  'Finally, when required under law, MyBoat will obtain your consent prior to processing your personal data, including for email marketing purposes or as otherwise required by law.',

  'If you wish to object to the processing set out under C to L and no opt-out mechanism is available to you directly (for example, in your account settings), contact us at',
  '&nbsp;myboat667@gmail.com.',

  'How does MyBoat share your data with third parties?',
  'In certain circumstances, we&rsquo;ll share your personal data with third parties. These third parties include:',

  'The Trip Provider You Booked: In order to complete your Trip Reservation, we transfer relevant reservation details to the Trip Provider you&#39;ve booked. This is one of the most essential things we do for you.',

  'Depending on the Trip Reservation and Trip Provider, the details we share can include your name, contact and payment details, the names of the people accompanying you, and any other info or preferences you specified when you made your Trip Reservation.',

  'In certain cases, we also provide some additional historical info about you to the Trip Provider. This includes whether you&rsquo;ve already booked with them in the past, the number of completed bookings you&rsquo;ve made with Booking.com, a confirmation that no misconduct has been reported about you, the percentage of bookings you&rsquo;ve canceled in the past, or whether you&rsquo;ve given reviews about past bookings.',

  'If you have a question about your Trip, we may contact the Trip Provider to handle your request. Unless payment is made during the booking process through the MyBoat website, we&rsquo;ll forward your credit card details to the booked Trip Provider for handling (assuming you provide us those details).',

  'In cases of Trip Reservation-related disputes, we may provide the Trip Provider with your contact details, including your email address and info about the Trip Reservation process needed to handle the dispute. This may include a copy of your reservation confirmation as proof that a Trip Reservation was actually made.',

  'Sometimes, at the direction of the Trip Provider, we&rsquo;ll need to share your personal data with parties related to the Trip Provider to finalize and administer your reservation. These parties might include other entities of a hotel group or service providers who are handling the data on the Trip Provider&rsquo;s behalf.',

  'Your local MyBoat office: To support the use of MyBoat services, your details may be shared with subsidiaries of the MyBoat corporate group, including for customer service. To find out more about the MyBoat corporate group, visit send us email at myboat667@gmail.com.',

  'Third-party service providers: We use service providers outside of the MyBoat corporate group to support us in providing our services. These include:',

  'Customer support',

  'Market research',

  'Fraud detection and prevention (including anti-fraud screening)',

  'Payment',

  'We use third parties to process payments, handle chargebacks or provide billing collection services. When a chargeback is requested for your Trip Reservation, either by you or the holder of the credit card used to make the reservation, we&rsquo;ll need to share certain reservation details with the payment service provider and the relevant financial institution so they can handle the chargeback. This could also include a copy of your reservation confirmation or the IP address used to make your reservation. We might share information with relevant financial institutions if we consider it strictly necessary for fraud detection and prevention purposes.',

  'Marketing services',

  'We share personal data with advertising partners, including your email address, as part of marketing MyBoat services via third parties to ensure that relevant ads are shown to the right audience. We use techniques like hashing to enable the matching of your email address with an existing customer database so that your email address can&rsquo;t be used for other purposes. For info about other personalized ads and your choices, read our Cookie Statement.',

  'Advertising partners',

  'All service providers are required to continue to safeguard your personal data adequately.',

  'Competent Authorities: We disclose personal data to law enforcement to the extent required by law or strictly necessary for the prevention, detection, or prosecution of criminal acts and fraud, or if we&rsquo;re legally obliged to do so otherwise. We may need to further disclose personal data to competent authorities to protect and defend our rights or properties, or the rights and properties of our business partners.',

  'Business partners: We work with many business partners around the world. These business partners distribute or advertise the MyBoat services, including the services and products of our Trip Providers.',

  'When you make a reservation on one of our business partners&rsquo; websites or apps, certain personal data that you give them, such as your name and email address, address, payment details, and other relevant info will be forwarded to us to finalize and manage your Trip Reservation.',

  'If customer service is provided by the business partner, MyBoat will share relevant reservation details with them (as and when needed) to provide you with appropriate and efficient support.',

  'When you make a reservation through one of our business partners&rsquo; websites, the business partners can receive certain parts of your personal data related to the specific reservation and your interactions on these partner websites. This is for their commercial purposes.',

  'When you make a reservation on a business partner&rsquo;s website, take the time to read their privacy notice if you&rsquo;d like to understand how they process your personal data.',

  'For fraud detection and prevention purposes, we may also exchange info about our users with business partners, but only when strictly necessary',

  'Partner Offer: We may enable you to book using Partner Offer, which means your reservation is facilitated by a Trip Provider separate from the booked accommodation. As part of the reservation process, we&rsquo;ll need to share some relevant personal data with this Trip Provider.',

  'If Partner Offer is used, review the info provided in the booking process or check your reservation confirmation for more info about the Trip Provider and how your personal data is further processed by them.',

  'The MyBoat corporate group: Read about how we share your personal data with the MyBoat&nbsp; corporate group.',

  'How is your personal data shared within the MyBoat corporate group?',
  'MyBoat is part of the MyBoat corporate group. More info is available at MyBoat667@gmail.com',

  'We may receive personal data about you from other companies in the MyBoat corporate group or share your personal data with them for the following purposes:',

  'To provide services (including to make, administer, and manage reservations or handle payments)',

  'To provide customer service',

  'To detect, prevent, and investigate fraudulence or other illegal activities and data breaches',

  'For analytical and product improvement purposes',

  'To send you personalized offers or marketing with your consent, or as otherwise permitted by applicable law',

  'For hosting, technical support, overall maintenance, and maintaining security of such shared data',

  'To ensure compliance with applicable laws',

  'As applicable and unless indicated otherwise, for purposes A to F, Booking.com relies on its legitimate interest to share and receive personal data. For purpose G, MyBoat relies, where applicable, on compliance with legal obligations (such as legal law enforcement requests).',

  'All companies within the MyBoat group of companies may need to exchange personal customer data to ensure all users are protected from fraudulent activities on its online platforms.',
  'How does MyBoat process communications that you and your booked Trip Provider may send via MyBoat ?',
  'MyBoat can offer you and Trip Providers various ways to communicate about the Trip Services and existing Trip Reservations by directing communications via MyBoat . This also allows you and your Trip Provider to contact MyBoat with questions about your Trip Reservation through the website, our apps, and the other channels that we provide.',

  'MyBoat accesses communications and may use automated systems to review, scan, and analyze communications for the following reasons:',

  'Security purposes',

  'Fraud prevention',

  'Compliance with legal and regulatory requirements',

  'Investigations of potential misconduct',

  'Product development and improvement',

  'Research',

  'Customer engagement (including to provide you info and offers that we believe might interest you)',

  'Customer or technical support',

  'We reserve the right to review or block the delivery of communications that we, at our sole discretion, believe might contain malicious content or spam, or pose a risk to you, Trip Providers, MyBoat , or others.',

  'All communications sent or received using MyBoat communication tools will be received and stored by MyBoat. Business partners (through whose platforms you make a reservation) and Trip Providers might also choose to communicate with you directly by email or other channels that MyBoat doesn&rsquo;t control.',

  'How does MyBoat make use of mobile devices?',
  'We offer free apps for a range of different mobile devices, as well as versions of our regular website that are optimized for browsing on a phone and tablet.',

  'These apps and mobile websites process the personal details you give us in a similar way that our website does. They also allow you to use location services to find Trip Services nearby, if you want.',

  'With your consent, we may send you push notifications with information about your Trip Reservation. You can also grant us access to your location data or contact details in order to provide services you request. If you upload pictures to our platform, these pictures may include location info (known as metadata) as well. Read your mobile device&rsquo;s instructions to understand how to change your settings and control the sharing of this type of data.',

  'In order to optimize our services and marketing activities, and to make sure we give you a consistent user experience, we use something known as &ldquo;cross-device tracking.&rdquo; This can be done with or without the use of cookies. For more general info about cookies and other similar technologies, see our Cookie statement.',

  'With cross-device tracking, MyBoat is able to track user behavior across multiple devices. As part of cross-device tracking, we may combine data collected from a particular browser or mobile device with data from another computer or device that&rsquo;s linked to it.',

  'To optimize the content of the MyBoat newsletter, we combine searches and reservations made from different computers and devices. You can unsubscribe from the MyBoat newsletter anytime.',

  'Personalized ads shown to you on other websites or in apps, can be offered based on your activities on linked computers and devices. By changing the cookie settings on your device (see our Cookie statement under &ldquo;What are your choices?&rdquo;), you can change your cross-device tracking settings for advertisement purposes. You should know that logging out of your MyBoat account doesn&rsquo;t mean that you will no longer receive personalized ads.',

  'How does MyBoat make use of social media?',
  'At MyBoat , we use social media in different ways. We use it to facilitate the use of online reservation services, to promote our Trip Providers&rsquo; tour-related products and services, and to advertise, improve, and facilitate our own services.',

  'The use of social media features can result in the exchange of personal data between MyBoat and the social media service provider, as described below. You&rsquo;re free to not use any of the social media features available to you.',

  'Sign in with your social media account. We offer you the opportunity to sign in to a MyBoat user account with one of your social media accounts. We do this to reduce the need for you to remember different usernames and passwords for different online services.',

  'After signing in once, you&rsquo;ll always be able to use your social media account to sign in to your MyBoat account. You can decouple your MyBoat user account from your chosen social media account anytime you want.',

  'Integration of social media plugins: We&rsquo;ve also integrated social media plugins into MyBoat website and apps. This means that when you click one of the buttons (e.g. Facebook&rsquo;s &ldquo;Like&rdquo; button), certain info is shared with these social media providers.',

  'If you&rsquo;re logged-in to your social media account at the same time, your social media provider may relate this info to your social media account. Depending on your settings, they might also display these actions on your social media profile to others in your network.',

  'Other social media services and features. We may integrate other social media services (e.g. social media messaging) for you to interact with MyBoat or your contacts about our services.',

  'We may maintain social media accounts and offer apps on several social media sites. Whenever you connect with MyBoat through social media, your social media service provider may allow you to share info with us.',

  'If you choose to share, you will generally be told by your social media provider which information will be shared. For example, when you sign in to a MyBoat user account using your social media account, certain info may be shared with MyBoat , including your email address, age, or profile pictures saved to your social media account, depending on what you authorize.',

  'When you register with a MyBoat social media app or connect to a social media messaging service without a MyBoat user account, the info you choose to share with us may include the basic info available in your social media profile, including your email, status updates, and a list of your contacts.',

  'We&rsquo;ll use this info to help provide you with the service you requested, for example, to forward a message you want to send to your contacts or to create a personalized user experience on the app or our websites. It means that&mdash;if you want us to&mdash;we can customize our services to fit your needs, connecting you and your friends to the best tour destinations, as well as analyzing and enhancing our tour-related services.',

  'Your social media provider will be able to tell you more about how they use and process your data when you connect to MyBoat through them. This can include combining the personal data they collect when you use MyBoat through them with info they collect when you use other online platforms also linked to your social media account.',

  'If you decide to connect using your Facebook or Google account, review the following links for info about how these parties use data they receive: Facebook and Google.',

  'What security and retention procedures does MyBoat put in place to safeguard your personal data?',
  'We observe reasonable procedures to prevent unauthorized access to and the misuse of personal data.',

  'We use appropriate business systems and procedures to protect and safeguard the personal data you give us. We also use security procedures and technical and physical restrictions for accessing and using the personal data on our servers. Only authorized personnel are allowed to access personal data in the course of their work.',

  'We&rsquo;ll keep your personal data for as long as we think necessary to enable you to use our services or to provide our services to you (including maintaining your MyBoat user account, if you have one), to comply with applicable laws, to resolve any disputes, and to otherwise allow us to conduct our business, including to detect and prevent fraud or other illegal activities. All personal data we keep about you is covered by this Privacy Statement.',

  'For added protection, we strongly recommend setting up two-factor authentication for your MyBoat account. This adds an extra authentication step to make sure anyone who gets ahold of your username and password (e.g. through phishing or social engineering) won&rsquo;t be able to access your account. You can set this up in the Security section of your account settings.',

  'How does MyBoat treat personal data belonging to children?',
  'Our services aren&rsquo;t intended for children under 16, and we&rsquo;ll never collect their data unless it&rsquo;s provided by (and with the consent of) a parent or guardian. The limited cases we might need to collect data for include as part of a reservation, the purchase of other tour-related services, or in other exceptional circumstances, such as features addressed to families. Again, this will only be used and collected as provided by a parent or guardian and with their consent.',

  'If we find out that we processed info of a child under 16 without the valid consent of a parent or guardian, we reserve the right to delete it. moreover the boats owner will be handling the age or country law for reservation and booking',

  'How can you control the personal data you&rsquo;ve given to MyBoat ?',
  'We want you to be in control of how your personal data is used by us. You can do this in the following ways:',

  'You can ask us for a copy of the personal data we hold about you.',

  'You can inform us of any changes to your personal data or ask us to correct any of the personal data we hold about you. As explained below, you can make some of these changes yourself when you have a user account.',

  'In certain situations, you can ask us to erase, block, or restrict the processing of the personal data we hold about you, or object to particular ways that we use your personal data.',

  'In certain situations, you can also ask us to send the personal data you&#39;ve given us to a third party.',

  'Where we use your personal data on the basis of your consent, you&rsquo;re entitled to withdraw that consent at any time, subject to applicable law.',

  'Where we process your personal data based on legitimate interest or the public interest, you have the right to object to that use of your personal data at any time, subject to applicable law.',

  'We rely on you to make sure that your personal info is complete, accurate, and current. Let us know about any changes to or inaccuracies in your personal info as soon as possible.',

  'If you have a MyBoat user account, you can access a lot of your personal data through our website or apps. You&rsquo;ll generally find the option to add, update, or remove info we have about you in your account settings.',

  'If any of the personal data we have about you isn&rsquo;t accessible through our website or apps, you can send us a request, which won&rsquo;t cost you anything.',

  'If you want to exercise your right of access or erasure, all you need to do is complete and submit the Data Subject Request for MyBoat Customers form. For any requests relating to this Privacy Statement, to exercise any of your other rights, or if you have a complaint, contact our Data Protection Officer at myboat667@gmail.com. You can also contact your local data protection authority.',

  'If you want to object to your personal data being processed on the basis of legitimate interest and there&rsquo;s no option to opt out directly, contact us at myboat667@gmail.com',

  'Who is responsible for the processing of personal data via Booking.com and how to contact us?',
  'myboat controls the processing of personal data as described in this Privacy Statement, except where explicitly stated otherwise.',
  'If you have any questions about this Privacy Statement or our processing of your personal data, contact our Data Protection Officer at myboat667@gmail.com and we&rsquo;ll get back to you as soon as possible.',

  'For questions about a reservation, contact our customer service team through the customer service contact page.',

  'Requests from law enforcement should be submitted using the Law Enforcement process.',

  'Cookie statement',
  'Whenever you use our online services or apps, we use cookies and other online tracking technologies (which we&rsquo;ll also refer to as &ldquo;cookies&rdquo; for the purpose of this Cookie Statement).',

  'Cookies can be used in various ways, including to make the Booking.com website work, analyze traffic, or for advertising purposes.',

  'Read below to learn more about what a &ldquo;cookie&rdquo; is, how they&rsquo;re used, and what your choices are.',

  'What are cookies and other online tracking technologies?',

  'How are cookies used?',

  'What are your choices?',

  'What are cookies and online tracking technologies?',
  'A web browser cookie is a small text file that websites place on your computer&rsquo;s or mobile device&rsquo;s web browser.',

  'These cookies store info about the content you view and interact with to remember your preferences and settings or analyze how you use online services.',

  'Cookies are divided into &ldquo;first party&rdquo; and &ldquo;third party&rdquo;:',

  'First party cookies are the cookies served by the owner of the domain. In our case, that&rsquo;s MyBoat . Any cookie we place ourselves is a &ldquo;first-party cookie.&rdquo;',

  'Third-party cookies are cookies placed on our domains by trusted partners that we&rsquo;ve allowed to do so. These can be social media partners, advertising partners, security providers, and more.',

  'And they can be either &ldquo;session cookies&rdquo; or &ldquo;permanent cookies&rdquo;:',

  'Session cookies only exist until you close your browser, ending what&rsquo;s called your &ldquo;session.&rdquo; Then they&rsquo;re deleted.',

  'Permanent cookies have a range of lifespans and stay on your device after the browser is closed. On the MyBoat platform, we try to only serve permanent cookies (or allow permanent cookies to be served by third parties) that have a limited lifespan. However, for security reasons or in other exceptional circumstances, sometimes we may need to give a cookie a longer lifespan.',

  'Web browser cookies may store info such as your IP address or other identifiers, your browser type, and info about the content you view and interact with on digital services. By storing this info, web browser cookies can remember your preferences and settings for online services and analyze how you use them.',

  'Along with cookies, we also use tracking technologies that are very similar. Our website, emails, and mobile apps may contain small transparent image files or lines of code that record how you interact with them. These include &ldquo;web beacons,&rdquo; &ldquo;scripts,&rdquo; &ldquo;tracking URLs,&rdquo; or &ldquo;software development kits&rdquo; (known as SDKs):',

  'Web beacons have a lot of different names. They might also be known as web bugs, tracking bugs, tags, web tags, page tags, tracking pixels, pixel tags, 1x1 GIFs, or clear GIFs.',

  'In short, these beacons are a tiny graphic image of just one pixel that can be delivered to your device as part of a web page request, in an app, an advertisement, or an HTML email message.',

  'They can be used to retrieve info from your device, such as your device type, operating system, IP address, and the time of your visit. They are also used to serve and read cookies in your browser or to trigger the placement of a cookie.',

  'Scripts are small computer programs embedded within our web pages that give those pages a wide variety of extra functionality. Scripts make it possible for the website to function properly. For example, scripts power certain security features and enable basic interactive features on our website.',

  'Scripts can also be used for analytical or advertising purposes. For example, a script can collect info about how you use our website, such as which pages you visit or what you search for.',

  'Tracking URLs are links with a unique identifier in them. These are used to track which website brought you to the MyBoat website or app you&rsquo;re using. An example would be if you clicked from a social media page, search engine, or one of our affiliate partners&rsquo; websites.',

  'Software Development Kits (SDKs) are part of our apps&rsquo; source code. Unlike browser cookies, SDK data is stored in the app storage.',

  'They&rsquo;re used to analyze how the apps are being used or to send personalized push notifications. To do this, they record unique identifiers associated with your device, like your device ID, IP address, in-app activity, and network location.',

  'All these tracking technologies are referred to as &ldquo;cookies&rdquo; here in this Cookie Statement.',

  'How are cookies used?',
  'Cookies are used to collect info, including:',

  'IP address',

  'Device ID',

  'Viewed pages',

  'Browser type',

  'Browsing info',

  'Operating system',

  'Internet service provider',

  'Timestamp',

  'Whether you have responded to an advertisement',

  'A referral URL',

  'Features used or activities engaged in on the website/apps',

  'They allow you to be recognized as the same user across the pages of a website, devices, between websites, or when you use our apps. When it comes to purpose, they&rsquo;re divided into three categories: Functional cookies, analytical cookies, and marketing cookies.',

  'Functional cookies',
  'These are cookies required for our websites and apps to function and must be enabled for you to use our services.',

  'Functional cookies are used to create technologically advanced, user-friendly websites and apps that adapt automatically to your needs and preferences, so you can browse and book easily. This also includes enabling essential security and accessibility features.',

  'More specifically, these cookies:',

  'Enable our website and apps to work properly, so you can create an account, sign in, and manage your bookings.',

  'Remember your selected currency and language settings, past searches, and other preferences to help you use our website and apps efficiently and effectively.',

  'Remember your registration info so you don&rsquo;t have to retype your log-in credentials each time you visit our website or app. (Don&rsquo;t worry, passwords are always encrypted.)',

  'Analytical cookies',
  'These cookies measure and track how our website and apps are used. We use this info to improve our website, apps, and services.',

  'More specifically, these cookies:',

  'Help us understand how visitors and customers like you use Booking.com and our apps.',

  'Help improve our website, apps, and communications to make sure we&#39;re interesting and relevant.',

  'Allow us to find out what does and doesn&#39;t work on our website and apps.',

  'Help us understand the effectiveness of advertisements and communications.',

  'Teach us how users interact with our website or apps after they&rsquo;re shown an online ad, including ads on third-party websites.',

  'Enable our business partners to learn whether or not their customers make use of any accommodation offers integrated into their websites.',

  'The data we gather through these cookies can include which web pages you&rsquo;ve viewed, which referral/exit pages you&rsquo;ve entered and left from, which platform type you&rsquo;ve used, which emails you&rsquo;ve opened and acted upon, and date and timestamp info. It also means we can use details about how you&rsquo;ve interacted with the site or app, such as the number of clicks you make on a given screen, your mouse and scrolling activity, the search words you use, and the text you enter into various fields.',

  'Marketing cookies',
  'These cookies are used by MyBoat and our trusted partners to gather info about you over time, across multiple websites, applications, or other platforms.',

  'Marketing cookies help us to decide which products, services, and interest-based ads to show you, both on and off our website and apps.',

  'More specifically, these cookies:',

  'Categorize you into a certain interest profile, for example, based on the websites you visit and your click behavior. We use these profiles to display personalized content (e.g. travel ideas or specific accommodations) on MyBoat and other websites.',

  'Display personalized and interest-based ads both on the MyBoat website, our apps, and other websites. This is called &ldquo;retargeting&rdquo; and is based on your browsing activities, such as the destinations you&rsquo;ve searched for, the accommodations you&rsquo;ve viewed, and the prices you&rsquo;ve been shown. It can also be based on your shopping habits or other online activities.',

  'Retargeting ads can be shown to you both before and after you leave MyBoat since their aim is to encourage you to browse or return to our website. You might see these ads on websites, apps, or in emails.',

  'Integrate social media into our website and apps. This allows you to like or share content or products on social media such as Facebook, Instagram, YouTube, Twitter, Pinterest, Snapchat, and LinkedIn.',

  'These &ldquo;like&rdquo; and &ldquo;share&rdquo; buttons work using pieces of code from the individual social media providers, allowing third-party cookies to be placed on your device.',

  'These cookies can be purely functional, but can also be used to keep track of which websites you visit from their network, to build a profile of your online browsing behavior, and to show you personalized ads. This profile will be partly built using comparable info the providers receive from your visits to other websites in their network.',

  'To read more about what social media providers do with your personal data, take a look at their cookie and/or privacy statements: Facebook (includes Instagram, Messenger, and Audience Network), Snapchat, Pinterest, and Twitter. Be aware that these statements may be updated from time to time.',

  'We work with trusted third parties to collect data. We may occasionally share info with these third parties, such as your email address or phone number. These third parties might link your data to other info they collect to create custom audiences or deliver targeted ads. For info about how these third parties process your data, take a look at the following links: How Google uses information, Facebook&#39;s data policy.',

  'Non-cookie techniques &ndash; email pixels',
  'We may also use techniques like pixels, which we don&rsquo;t mark as cookies because they don&rsquo;t store any info on your device.',

  'We sometimes place pixels in emails like newsletters. A &ldquo;pixel&rdquo; is an electronic file the size of a single pixel that&rsquo;s placed in the email and loaded when you open it. By using email pixels, we can see if the message was delivered, if and when you read it, and what you click.',

  'We also receive this info about the push notifications we send you. These statistics provide us with feedback about your reading behavior, which we use to optimize our messages, and make our communications more relevant to you.',

  'What are your choices?',
  'To learn more about cookies and how to manage or delete them, visit allaboutcookies.org or the help section of your browser.',

  'Under the settings for browsers like Internet Explorer, Safari, Firefox, or Chrome, you can choose which cookies to accept and reject. Where you find these settings depends on the browser you use:',

  'Cookie settings in Chrome',

  'Cookie settings in Firefox',

  'Cookie settings in Internet Explorer',

  'Cookie settings in Safari',

  'If you choose to block certain functional cookies, you may not be able to use some features of our services.',

  'In addition to specific settings that we may offer on the MyBoat and apps, you can also opt out of certain cookies:',

  'Analytics',

  'To prevent Google Analytics from collecting analytical data on certain browser types visit the following link: Google Analytics Opt-out Browser Add-on (only available on desktop).',

  'Advertising',

  'We always aim to work with advertising and marketing companies that are members of the Network Advertising Initiative (NAI) and/or the Interactive Advertising Bureau (IAB).',

  'Members of the NAI and IAB adhere to industry standards and codes of conduct, and allow you to opt out of behavioral advertising.',
  'Visitto identify NAI members that may have placed advertising cookies on your computer. To opt out of any NAI member&#39;s behavioral advertising program, just check the box that corresponds to that company.',
  'www.networkadvertising.org',
  'You may also want to visitorto learn how to opt out of customized ads.',
  'www.youronlinechoices.com',
  'www.youronlinechoices.com',
  'Your mobile device may allow you to limit the sharing of info for retargeting purposes through its settings. If you choose to do so, remember that opting out of an online advertising network doesn&#39;t mean you&rsquo;ll no longer see or be subject to online advertising or marketing analysis. It just means the network you opted out of won&#39;t deliver ads customized to your web preferences and browsing patterns anymore.',

  'Some websites have &ldquo;Do Not Track&rdquo; features that allow you to tell a website not to track you. We&rsquo;re currently unable to support &ldquo;Do Not Track&rdquo; browser settings.',

  'How to contact us',
  'If you have any questions about this cookie statement, write us at myboat667@gmail.com',

  'Our cookie statement may also be updated from time to time. If these updates are substantial, particularly relevant to you, or impact your data protection rights, we&rsquo;ll get in touch with you about them. However, we recommend visiting this page regularly to stay up to date with any other (less substantial or relevant) updates.',
];
const privacyPolicy = (props) => {
  console.log('props', props)
  const [content , getContent] =  useState([]);
  React.useEffect(async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');

    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      '/get_all_content.php?user_id=' +
      parsedInfo.id +
      '&user_type=2';
      axios
      .get(url)
      .then((res) => {
        console.log(res, "res getting permission");
        console.log('first', res.data.content_arr[1].content[0])
        if (res.data.success == 'true'){
          {props.language_id == 1 ? getContent(res.data.content_arr[1].content[1]) : getContent(res.data.content_arr[1].content[0])}

        }
      })
      .catch((err) => console.log(err));
  }, []);

  function webViewTextSize(data) {
    return `
       <!DOCTYPE html>
       <html>
       <head>
         <style type="text/css">
           body {
             font-family: Helvetica;
             font-size: 3rem;
             color: black;
             padding: 20px 20px 20px 20px;
           } 
           p {
             text-align: center;
           }
         </style>
       </head>
       <meta name="viewport" content="initial-scale=0.1, maximum-scale=0.1">
       <body>
         ${data}
       </body>
       </html>
       `;
  }
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Header backBtn={true} imgBack={true} name="Privacy Policy" />
      <View style={subrata.SEC2}>
      <WebView
            startInLoadingState={true}
            originWhitelist={['*']}
            source={{html: webViewTextSize(content)}}
            javaScriptEnabled={true}
            // source={{ html: '<h1>Hellogdfgdfgfdgdgdgdgggdggdgdfggdgdggdfgdfgdfgdfgdgdg </h1>' }}
            style={{
              marginTop: 15,
              textAlign: 'center',
            }}
            height={750}
          />
      </View>
    </View>
  );
};
const subrata = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    marginTop: -40,
    flex: 1,
  },
});
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
  permissions: state.data_Reducer.permissions,
});

export default connect(mapStateToProps)(privacyPolicy);

