export type AccountType='guardian'|'shelter'|'petbiz'|'rave_vendor';
export type MarketChannel='pet'|'rave'|'shared';
export const accountRegistrationPath=(type:AccountType)=>`/register?type=${type}`;
export const legacyRegistrationTarget='/register?type=guardian&source=business-card';
export const verificationReminderDays=[10,20,27] as const;
export const verificationExpiryDays=30;
