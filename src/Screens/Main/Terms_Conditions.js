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
import I18n from '../../Translations/i18'
import {Icon, Input, Card} from 'react-native-elements';
import {Colors, FontFamily, Sizes} from '../../Constants/Constants';
import {useNavigation} from '@react-navigation/core';
import Header from '../../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import WebView from 'react-native-webview';
import { connect } from "react-redux";
import config from '../../Constants/config';


const termsAndConditions = [
  'Introduction TCs',
  'These terms and conditions, as may be amended from time to time, apply to all our services directly or indirectly (through distributors) made available online, through any mobile device, by email, or by telephone. By accessing, browsing, and using our (mobile) website or any of our applications through whatever platform (hereafter collectively referred to as the &quot;Platform&quot;) and/or by completing a reservation, you acknowledge and agree to have read, understood, and agreed to the terms and conditions set out below (including the privacy statement).',
  '&nbsp;',
  'These pages, the content, and infrastructure of these pages and the online reservation service (including the facilitation of payment service) provided by us on these pages and through the website are owned, operated, and provided by MyBoat and are provided for your personal, non-commercial (B2C) use only, subject to the terms and conditions set out below. The relationship that we have with the Trip Providers are governed by separate terms and conditions which govern the (B2B) commercial relationship we have with each of these Trip Providers. Each Trip Provider acts in a professional manner. MyBoat when making its product and/or service available on or through MyBoat (both for its business-to-business (&quot;B2B&quot;) and/or business-to-consumer (&quot;B2C&quot;) relationship). Note that Trip Providers may have, declare applicable, and/or require (acceptance of) &ndash; in addition to the policies and fine print as disclosed on the website, their own (delivery/shipping/carriage/usage) terms and conditions and house rules for the use, access, and consummation of the Trip (which may include certain disclaimers and limitations of liability).',
  '&nbsp;',
  'Definitions',
  '&quot;MyBoat ,&quot; &quot;us,&quot; &quot;we,&quot; or &quot;our&quot; means MyBoat a personal owner in kuwait. &quot;Platform&quot; means the (mobile) website and app on which the Trip Service is made available owned, controlled, managed, maintained, and/or hosted by MyBoat. &quot;Trip&quot; means the various different travel products and services that can be ordered, acquired, purchased, bought, paid, rented, provided, reserved, combined, or consummated by you from the Trip Provider.',
  '&nbsp;',
  '&quot;Trip Provider&quot; means the provider of trips (e.g. tour, fishing, anniversary trip, transportations), trip operators, and any other travel or related product or service as from time to time available for Trip Reservation on the Platform (whether B2B or B2C).',
  '&nbsp;',
  '&quot;Trip Service&quot; means the online purchase, order, (facilitated) payment, or reservation service as offered or enabled by MyBoat in respect to various products and services as from time to time made available by Trip Providers on the Platform.',
  '&nbsp;',
  '&quot;Trip Reservation&quot; means the order, purchase, payment, booking, or reservation of a Trip.',
  '&nbsp;',
  '1. Scope &amp; Nature of Our Service',
  'Through the Platform, we (MyBoat) provide an online platform through which Trip Providers&mdash;in their professional conduct of business (i.e. B2C or B2B)&mdash;can advertise, market, sell, promote, and/or offer (as applicable) their products and service for order, purchase, reservation, rent, or hire, and through which relevant visitors of the Platform can discover, search, compare, and make an order, reservation, purchase, or payment (i.e. the Trip Service). By using or utilizing the Trip Service (e.g. by making a Trip Reservation through the Trip Service), you enter into a direct (legally binding) contractual relationship with the Trip Provider with which you make a reservation or purchase a product or service (as applicable). From the point at which you make your Trip Reservation, we act solely as an intermediary between you and the Trip Provider, transmitting the relevant details of your Trip Reservation to the relevant Trip Provider(s) and sending you a confirmation email for and on behalf of the Trip Provider. MyBoat does not (re)sell, rent out, offer any (trips) product or service.',
  '&nbsp;',
  'When rendering our Trip Service, the information that we disclose is based on the information provided to us by Trip Providers. As such, the Trip Providers that market and promote their Trips on the Platform are given access to our systems and Extranet through which they are fully responsible for updating all rates/fees/prices, availability, policies, conditions, and other relevant information that gets displayed on our Platform. Although we will use reasonable skill and care in performing our Trip Service, we will not verify and cannot guarantee that all information is accurate, complete, or correct, nor can we be held responsible for any errors (including manifest and typographical errors), any interruptions (whether due to any (temporary and/or partial) breakdown, repair, upgrade, or maintenance of our Platform or otherwise), inaccurate, misleading, or untrue information, nor non-delivery of information. Each Trip Provider remains responsible at all times for the accuracy, completeness, and correctness of the (descriptive) information (including the rates/fees/prices, policies, conditions, and availability) displayed on our Platform. Our Platform does not constitute and should not be regarded as a recommendation or endorsement of the quality, service level, qualification, (star) rating, or type of trip of any Trip Provider (or its facilities, venue, vehicles, (main or supplemental) products or services) made available, unless explicitly indicated or set out otherwise.',
  '&nbsp;',
  'Our Trip Service is made available for personal and non-commercial use only. Therefore, you are not allowed to resell, deep link, use, copy, monitor (e.g. spider, scrape), display, download, or reproduce any content or information, software, reservations, tickets, products, or services available on our Platform for any commercial or competitive activity or purpose.',
  '&nbsp;',
  '2. Prices, We Price Match, promotion program, and offers facilitated by a partner company',
  'The prices as offered by the Trip Providers on our Platform are highly competitive. All prices for your Trip are displayed including VAT/sales tax and all other taxes (subject to change of such taxes) and fees, unless stated differently on our Platform or the confirmation email/ticket. Ticket prices are per person or group and subject to validity or expiration as indicated on the ticket, if applicable. Applicable fees and taxes (including tourist/city tax) may be charged by the Trip Provider in the event of a no-show or cancellation.',
  '&nbsp;',
  'Sometimes cheaper rates are available on our Platform for a specific trip, product, or service, however, these rates made available by Trip Providers may carry special restrictions and conditions, for example non-cancelable and non-refundable. Check the relevant product, service, and reservation conditions and details thoroughly for any such conditions prior to making your reservation.',
  '&nbsp;',
  'We want you to pay the lowest price possible for your product and service of choice. Should you find your property of choice booked through the Platform, with the same Trip conditions, at a lower rate on the Internet after you have made a reservation through us, we will match the difference between our rate and the lower rate under the terms and conditions of the We Price Match. Our We Price Match promise does not apply to non-trip related products and services.',
  '&nbsp;',
  'The currency converter is for information purposes only and should not be relied upon as accurate and real time; actual rates may vary.',
  '&nbsp;',
  'Obvious errors and mistakes (including misprints) are not binding.',
  '&nbsp;',
  'All special offers and promotions are marked as such. If they are not labeled as such, you cannot derive any rights in the event of obvious errors or mistakes.',
  '&nbsp;',
  'promotion program',
  'The promotion rate is a discounted rate offered by participating boats for certain dates / trip types.',
  '&nbsp;',
  'The promotion rate is for members of the MyBoat promotion program. The promotion program is open to anyone that has an account on the Platform. There are no membership fees, and all you need to do to become a member is complete register membership and the promotion rates are for that individual member and are non-transferable. Membership can also be linked to specific campaigns or incentives, as occasionally launched or communicated per MyBoat sole discretion.',
  '&nbsp;',
  'MyBoat reserves the right to revoke and cancel the promotion program membership of any individual in the event of abuse, such as violation of these terms &amp; conditions and / or use of invalid credit cards. MyBoat furthermore reserves the right to revoke and cancel the promotion membership of any individual who engages in inappropriate behavior, such as violence, threat, harassment, discrimination, obscenity, or fraud in relation to MyBoat (or its employees and agents) and / or the service provider (or its employees and agents).',
  '&nbsp;',
  'The promotion rate cannot be combined or used with other discounts (unless approved by the provider or indicated otherwise). MyBoat may, at its discretion, (partially) alter, limit, or modify the promotion program structure or any other feature of the program (including but not limited to the (status of the) subject promotion level(s)), for any reason, without prior notice.',
  '&nbsp;',
  'The promotion membership is linked to your account on MyBoat and will not expire or otherwise terminate unless you terminate, close, delete, or otherwise revoke your account. Without notice to you, MyBoat also reserves the right to &ldquo;unregister&quot; or otherwise disable an account that is inactive. An inactive account is defined as an account that has not made a reservation for more than five (2) years. In the event that your account is might be disabled, you will no longer be eligible for the promotion benefits. You may reactivate your account by making a qualifying reservation using your MyBoat account.',
  '&nbsp;',
  'Partner offer',
  'MyBoat may display offers that are not directly sourced from Trip Providers, but are facilitated by a MyBoat partner company, such as another platform (Partner offer). Partner offers will be clearly displayed and distinguished from the regular offers directly sourced from Trip Providers and have the following special conditions, unless mentioned otherwise on our Platform:',
  '&nbsp;',
  'Price policy: As displayed on our Platform.',
  'Pay in advance: You&rsquo;ll pay securely with MyBoat at the time of the booking.',
  'No modifications: Once your booking is complete, any changes to your personal or booking details won&#39;t be possible. Requests can be made directly with the admin/or on his behalf but are not guaranteed.',
  'Can&#39;t combine with other offers: Other promotions, incentives, and rewards are not eligible on the booking.',
  'No guest review: It&rsquo;s not possible to leave a guest review on our Platform.',
  '3. Privacy and Cookies',
  'MyBoat respects your privacy. Please take a look at our Privacy and Cookies Policy for further information.',
  '&nbsp;',
  '4. Free or little charge for consumers, Trip Providers pay the rest!',
  'Unless indicated otherwise, our service is free of charge might be very little charge for consumers because, unlike many other parties, we will not charge you for all our Trip Service or add too much additional (reservation) fees to the rate. You will pay the Trip Provider the relevant amount as indicated in the Trip Reservation (plus&mdash;insofar not included in the price&mdash;relevant applicable taxes, levies, and fees (if applicable)).',
  '&nbsp;',
  'Trip Providers pay a commission (being a small percentage of the product price (e.g. book price)) to MyBoat after the end user has consummated the service or product of the Trip Provider (e.g. after the guest has finished the trip at (and paid) the trips). Trip Providers can improve their ranking by increasing their commission (Visibility Booster). The use of the Visibility Booster (by increasing the commission in return for a better position in the ranking) is at each Trip Provider&#39;s discretion and may be used from time to time and product to product offered. The algorithm of the ranking will take an increase in commission into account when determining the Default Ranking. Preferred partners pay a higher commission in return for a better position in the ranking.',
  '&nbsp;',
  'Only Trip Providers which have a commercial relationship with MyBoat (through an agreement) will be made available on Platform (for their B2B and/or B2C promotion of their product). MyBoat is not an open platform (like Amazon or eBay) where end users can make their product available (no C2C platform); MyBoat does not allow non-professional parties to offer or sell their products on or through MyBoat .',
  'some might be apply or changed in this topic',
  '&nbsp;',
  '5. Credit Card or Bank Transfer',
  'If applicable and available, certain Trip Providers offer the opportunity for Trip Reservations to be paid (wholly or partly and as required under the payment policy of the Trip Provider) to the Trip Provider during the Trip Reservation process, by means of secure online payment (all to the extent offered and supported by your bank). For certain products and services, MyBoat facilitates (through third party payment processors) the payment of the relevant product or service (i.e. the payment facilitation service) for and on behalf of the Trip Provider (MyBoat never acts nor operates as the merchant of record). Payment is safely processed from your credit/debit card or bank account to the bank account of the trip provider through a third party payment processor. Any payment facilitated by us for and on behalf of, and transferred to the Trip Provider will in each case constitute a payment of (part of) the booking price by you of the relevant product or service in final settlement of such (partial) due and payable price and you cannot reclaim such paid monies.',
  '&nbsp;',
  'For certain (non-refundable) rates or special offers, note that Trip Providers may require that payment be made upfront by wire transfer (if available) or by credit card, and therefore your credit card may be pre-authorized or charged (sometimes without any option for refund) upon making the Trip Reservation. Check the (reservation) details of your product or service of choice thoroughly for any such conditions prior to making your Trip Reservation. You will not hold MyBoat liable or responsible for any (authorized, (allegedly) unauthorized or wrong) charge by the Trip Provider and not (re)claim any amount for any valid or authorized charge by the Trip Provider (including for pre-paid rates, no-show, and chargeable cancellation) of your credit card.',
  '&nbsp;',
  'In the event of credit card fraud or unauthorized use of your credit card by third parties, most banks and credit card companies bear the risk and cover all charges resulting from such fraud or misuse, which may sometimes be subject to a deductible (usually set at EUR 5 (or the equivalent in your local currency)). In the event that your credit card company or bank charges the deductible from you due to unauthorized transactions resulting from a reservation made on our Platform, we will pay you this deductible, up to an aggregate amount of EUR 5 (or the equivalent in your local currency). In order to indemnify you, please report fraud to your credit card provider (in accordance with its reporting rules and procedures) and contact us immediately. Please provide us with evidence of the charged deductible (e.g. policy of the credit card company). This indemnification only applies to credit card reservations made using MyBoat secure server and the unauthorized use of your credit card resulting through our default or negligence and through no fault of your own while using the secure server.',
  '&nbsp;',
  '6. Prepayment, Cancellation, No-shows, and The Fine Print',
  'By making a Trip Reservation with a Trip Provider, you accept and agree to the relevant cancellation and no-show policy of that Trip Provider, and to any additional (delivery) terms and conditions of the Trip Provider that may apply to your Trip (including the fine print of the Trip Provider made available on our Platform and the relevant house rules of the Trip Provider), including for services rendered and/or products offered by the Trip Provider. The relevant (delivery/purchase/use/carrier) terms and conditions of a Trip Provider can be obtained with the relevant Trip Provider. The general cancellation and no-show policy of each Trip Provider is made available on our Platform on the Trip Provider information pages, during the reservation procedure and in the confirmation email or ticket (if applicable). Note that certain rates, fees, or special offers are not eligible for cancellation, refund, or change. Applicable city/tourist tax may still be charged by the Trip Provider in the event of a no-show or charged cancellation. Check the (reservation) details of your product or service of choice thoroughly for any such conditions prior to making your reservation. Note that a Trip Reservation which requires down payment or (wholly or partly) prepayment may be canceled (without a prior notice of default or warning) insofar the relevant (remaining) amount(s) cannot be collected in full on the relevant due or payment date in accordance with the relevant payment policy of the Trip Provider and the reservation. Cancellation and prepayment policies may vary per segment, product, or service of each Trip. Carefully read The Fine Print (below the Trip types or at the bottom of each Trip Provider page on our Platform) and important information in your reservation confirmation for additional policies as may be applied by the Trip Provider (e.g. in respect of age requirement, security deposit, non-cancellation/additional supplements for group bookings, cards accepted). Late payment, wrong bank, debit or credit card details, invalid credit/debit cards, or insufficient funds are for your own risk and account, and you will not be entitled to any refund of any (non-refundable) prepaid amount unless the Trip Provider agrees or allows otherwise under its (pre)payment and cancellation policy.',
  '&nbsp;',
  'If you want to review, adjust, or cancel your Trip Reservation, revert to the confirmation email and follow the instructions therein. Note that you may be charged for your cancellation in accordance with the Trip Provider&#39;s cancellation, (pre)payment and no-show policy, or not be entitled to any repayment of any (pre)paid amount. We recommend that you read the cancellation, (pre)payment and no-show policy of the trip provider carefully prior to making your reservation, and remember to make further payments on time as may be required for the relevant reservation.',
  '&nbsp;',
  'If you have a late or delayed arrival on the check-in date or only arrive the next day, make sure to (timely/promptly) communicate this with the Trip Provider so they know when to expect you to avoid cancellation of your Trip (Reservation) or charge of the no-show fee. Our customer service department can help you if needed with informing the Trip Provider. MyBoat does not accept any liability or responsibility for the consequences of your delayed arrival or any cancellation or charged no-show fee by the Trip Provider.',
  '&nbsp;',
  '7. (Further) Correspondence and Communication',
  'By completing a Trip Reservation, you agree to receive (i) an email/notification which we may send you shortly prior to your arrival date, giving you information on your destination and providing you with certain information and offers (including third-party offers to the extent that you have actively opted in for this information) relevant to your Trip (Reservation) and destination, (ii) an email/notification after arrival to rate the (experience with your) Trip Provider and the Trip Service, and (iii) an email/notification which we may send to you promptly after your trip inviting you to complete our guest review form. See our privacy and cookies policy for more information about how we may contact you.',
  '&nbsp;',
  'MyBoat disclaims any liability or responsibility for any communication by or with the Trip Provider on or through its platform. You cannot derive any rights from any request to, or communication with the Trip Provider or (any form of) acknowledgement of receipt of any communication or request. MyBoat cannot guarantee that any request or communication will be (duly and timely) received/read by, complied with, executed, or accepted by the Trip Provider.',
  '&nbsp;',
  'In order to duly complete and secure your Trip Reservation, you need to use your correct email address. We are not responsible or liable for (and have no obligation to verify) any wrong or misspelled email address, or inaccurate or wrong (mobile) phone number or credit card number.',
  '&nbsp;',
  'Any claim or complaint against MyBoat or in respect to the Trip Service must be promptly submitted, but in any event 10 days after the scheduled day of consummation of the product or service (e.g. check out date). Any claim or complaint that is submitted after the 10 days period may be rejected, and the claimant will forfeit the right to any (damage or cost) compensation.',
  '&nbsp;',
  'Due to the continuous update and adjustments of rates and availability, we strongly suggest to make screenshots when making a reservation to support your position (if needed).',
  '&nbsp;',
  '8. Ranking, Preferred Program, Stars and Guest Reviews',
  'We aim to display search results that are relevant to you by providing a personalized default ranking of Trip Providers on our Platform. You can scroll through this default ranking, use filters, and sort by alternative ranking orders and thus have the ability to influence the presentation of search results to receive a ranking order based on other criteria. We use multiple algorithms to produce default ranking results, a process that&#39;s constantly evolving.',
  '&nbsp;',
  'MyBoat has identified the following parameters to be most closely correlated with you finding a suitable Trip Provider and thus prioritizes these parameters in the algorithms (main parameters): Your personal search history, the rate of &quot;click-through&quot; from the search page to the hotel page (&quot;CTR&quot;), the number of bookings related to the number of visits to the Trip Provider page on the Platform (&quot;Conversion&quot;), gross (including cancellations) and net (excluding cancellations) bookings of a Trip Provider. Conversion and CTR may be affected by various (stand-alone) factors including review scores (both aggregate scores and components), availability, policies, (competitive) pricing, quality of content, and certain features of the Trip Provider. The commission percentage paid by the Trip Provider or other benefits to us (e.g. through commercial arrangements with the Trip Provider or strategic partners) may also impact the default ranking, as well as the Trip Provider&rsquo;s record of on-time payment. The Trip Provider can also influence its ranking by participating in certain program, which may be updated from time to time, such as the promotion program, deals, the Preferred Partner Program, and the visibility booster (the latter two involve the Trip Provider paying us a higher commission).',
  '&nbsp;',
  'In order to make it easier for customers to find the right match to their travel preferences, MyBoat may assign a quality rating, which is determined by MyBoat and displayed as a yellow tile, to certain boats. In order to determine the comparable set, the quality rating is based on many (400+) features that can be divided over 5 major categories: (i) facilities/amenities/services offered by the trip on MyBoat , (ii) property configuration such as unit size, number of rooms, and occupancy, (iii) number and quality of the photos uploaded by the provider, (iv) average guest review score as well as some subscores (e.g. cleanliness) because those are proven to be particularly helpful for customers in assessing the quality of the trip, and (v) anonymized and aggregated historical booking data (e.g. to assess the star rating of booked trip). We use these multiple features to derive statistical patterns. Based on these inputs, a machine-learning-based analysis is conducted which results in a quality rating (between 1&ndash;5, displayed by using 1&ndash;5 yellow tiles next to the name of the property) being automatically calculated and awarded to the trip',
  '&nbsp;',
  'Only customers who have done at the trip will be invited by MyBoat to comment on their trip at the relevant trips and to provide a score for certain aspects of their trip or may receive a rating request during their trip. The completed guest review (including submitted rating during your trip) may be (a) uploaded onto the relevant Trip Provider&#39;s information page on our Platform for the sole purpose of informing (future) customers of your opinion of the service (level) and quality of the Trip Provider, and (b) (wholly or partly) used and placed by MyBoat at its sole discretion (e.g. for marketing, promotion, or improvement of our services) on our Platform or such social media platforms, newsletters, special promotions, apps, or other channels owned, hosted, used, or controlled by MyBoat and our business partners. In order to offer and maintain recent (and therefore relevant) reviews, reviews can only be submitted within a limited period of time after a trip, and each review will only be available for a limited period of time after posting. The default ranking of the reviews is by date of submission relative to a few additional criteria (such as language, reviews with comments), whereas a review of a customer who [always] submits comprehensive and detailed reviews (aka &quot;Property Scout&quot;) may be ranked on top. You have the option to choose various forms of rankings and filters (e.g. by audience, date, language, score). MyBoat might does allow the Trip Provider to respond to a review. We reserve the right to adjust, refuse, or remove reviews at our sole discretion insofar as it violates our review policy. MyBoat does not compensate or otherwise reward customers for completing a review. The guest review form should be regarded as a survey and does not include any (further commercial) offers, invitations, or incentives whatsoever. MyBoat undertakes its best efforts to monitor and remove reviews that include obscenities, mentions of an individual&rsquo;s name, or references to stolen goods.',
  '&nbsp;',
  'MyBoat will not accept reviews which include:',
  '&nbsp;',
  'Profanity, sexually explicit, hate speech, discriminatory, threats, violence',
  'Mention of full names, personal attack towards the staff',
  'Promoting illegal activities (e.g. drugs, prostitution)',
  'Sites, emails, and addresses, phone numbers, cc details',
  'Politically sensitive comments',
  'MyBoat and the Trip Provider are each entitled to terminate their relationship for whatever reason (including in the event of breach of contract or (filing for) bankruptcy) with due observance of the relevant notice period as agreed between both parties.',
  'changes might apply accourding to MyBoat and also have the rights to do legal actions',
  '&nbsp;',
  '9. Disclaimer',
  'Subject to the limitations set out in these terms and conditions and to the extent permitted by law, we will only be liable for direct damages actually suffered, paid, or incurred by you due to an attributable shortcoming of our obligations in respect to our services, up to an aggregate amount of the aggregate cost of your reservation as set out in the Trip Reservation confirmation email (whether for one event or series of connected events).',
  '&nbsp;',
  'However and to the extent permitted by law, neither we nor any of our officers, directors, employees, representatives, subsidiaries, distributors, (distribution) partners, licensees, agents, or others involved in creating, sponsoring, promoting, or otherwise making available the site and its contents will be liable for (i) any punitive, special, indirect, or consequential loss or damages, any loss of production, loss of profit, loss of revenue, loss of contract, loss of or damage to goodwill or reputation, loss of claim, (ii) any inaccuracy relating to the (descriptive) information (including rates, availability, and ratings) of the Trip Provider as made available on our Platform, (iii) the services rendered or the products offered by the Trip Provider or other business partners, (iv) any (direct, indirect, consequential, or punitive) damages, losses, or costs suffered, incurred, or paid by you, pursuant to, arising out of or in connection with the use, inability to use, or delay of our Platform, or (v) any (personal) injury, death, property damage, or other (direct, indirect, special, consequential, or punitive) damages, losses, or costs suffered, incurred or paid by you, whether due to (legal) acts, errors, breaches, (gross) negligence, willful misconduct, omissions, non-performance, misrepresentations, tort or strict liability by or (wholly or partly) attributable to the Trip Provider or any of our other business partners (including any of their employees, directors, officers, agents, representatives, subcontractors, or affiliated companies) whose products or service are (directly or indirectly) made available, offered, or promoted on or through the Platform, including any (partial) cancellation, overbooking, strike, force majeure, or any other event beyond our control.',
  '&nbsp;',
  'MyBoat is not responsible (and disclaims any liability) for the use, validity, quality, suitability, fitness, and due disclosure of the Trip and makes no representations, warranties, or conditions of any kind in this respect, whether implied, statutory or otherwise, including any implied warranties of merchantability, title, non-infringement, or fitness for a particular purpose. You acknowledge and agree that the relevant Trip Provider is solely responsible and assumes all responsibility and liability in respect of the Trip (including any warranties and representations made by the Trip Provider). MyBoat is not a (re)seller of the Trip. Complaints or claims in respect of the Trip (including related to the offered (special/promotion) price, policy or specific requests made by Customers) are to be dealt with by the Trip Provider. MyBoat is not responsible for and disclaims any liability in respect of such complaints, claims, and (product) liabilities.',
  '&nbsp;',
  'Whether or not the Trip Provider has charged you for your Trip, or if we are facilitating the payment of the (Trip) price or fee, you agree and acknowledge that the Trip Provider is at all times responsible for the collection, withholding, remittance, and payment of the applicable taxes due on the total amount of the (Trip) price or fee to the relevant tax authorities. MyBoat is not liable or responsible for the remittance, collection, withholding, or payment of the relevant taxes due on the (Trip) price or fee to the relevant tax authorities. MyBoat does not act as the merchant of record for any product or service made available on the Platform.',
  '&nbsp;',
  'By uploading photos/images onto our system (for instance in addition to a review) you certify, warrant and agree that you own the copyright to the photos/images and that you agree that MyBoat may use the uploaded photos/images on its (mobile) website and app, and in (online/offline) promotional materials and publications and as MyBoat at its discretion sees fit. You are granting MyBoat a non-exclusive, worldwide, irrevocable, unconditional, perpetual right and license to use, reproduce, display, have reproduced, distribute, sublicense, communicate and make available the photos/images as MyBoat at its discretion sees fit. By uploading these photos/images the person uploading the picture(s) accepts full legal and moral responsibility of any and all legal claims that are made by any third parties (including, but not limited to, property owners) due to MyBoat publishing and using these photos/images. MyBoat does not own or endorse the photos/images that are uploaded. The truthfulness, validity and right to use of all photos/images is assumed by the person who uploaded the photo, and is not the responsibility of MyBoat MyBoat disclaims all responsibility and liability for the pictures posted. The person who uploaded the photo warrants that the photos/images shall not contain any viruses, Trojan horses or infected files and shall not contain any pornographic, illegal, obscene, insulting, objectionable or inappropriate material and does not infringe any third party (intellectual property right, copyright or privacy) rights. Any photo/image that does not meet the aforesaid criteria will not be posted and/or can be removed/deleted by MyBoat at any time and without prior notice.',
  '&nbsp;',
  '10. Intellectual Property Rights',
  'Unless stated otherwise, the software required for our services or available at or used by our Platform and the intellectual property rights (including the copyrights) of the contents and information of and material on our Platform are owned by MyBoat its Trip Providers or providers.',
  '&nbsp;',
  'MyBoat exclusively retains ownership of all rights, title and interest in and to (all intellectual property rights of) (the look and feel (including infrastructure) of) the Platform on which the service is made available (including the guest reviews and translated content) and you are not entitled to copy, scrape, (hyper-/deep)link to, publish, promote, market, integrate, utilize, combine or otherwise use the content (including any translations thereof and the guest reviews) or our brand without our express written permission. To the extent that you would (wholly or partly) use or combine our (translated) content (including guest reviews) or would otherwise own any intellectual property rights in the Platform or any (translated) content or guest reviews, you hereby assign, transfer and set over all such intellectual property rights to MyBoat . Any unlawful use or any of the aforementioned actions or behaviour will constitute a material infringement of our intellectual property rights (including copyright and database right).',
  '&nbsp;',
];
const Terms_Conditions = (props) => {
console.log(props , 'props ion terms and condition ');
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
        console.log('first', res.data.content_arr[2].content[0])
        if (res.data.success == 'true'){
          {props.language_id == 1 ? getContent(res.data.content_arr[2].content[1]) : getContent(res.data.content_arr[2].content[0])}

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
      <Header backBtn={true} imgBack={true} name="Terms & Conditions" />
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

export default connect(mapStateToProps)(Terms_Conditions);

