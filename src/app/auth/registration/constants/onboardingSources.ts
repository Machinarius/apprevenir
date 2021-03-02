export enum OnboardingSourcesKeys {
  SELF,
  GOVERNMENT,
  SCHOOL,
  UNIVERSITY
}

export const OnboardingSources = [{
  key: OnboardingSourcesKeys.SELF,
  label: "Por iniciativa propia"
}, {
  key: OnboardingSourcesKeys.GOVERNMENT,
  label: "Mi ciudad o municipio"
}, {
  key: OnboardingSourcesKeys.SCHOOL,
  label: "Mi institución educativa"
}, {
  key: OnboardingSourcesKeys.UNIVERSITY,
  label: "Mi universidad"
}];