export default async function loadFakeUniversities(): Promise<{ id: number, label: string}[]> {
  const fakeUniversities = [{
    id: 1,
    label: "Universidad Católica Luis Amigó"
  }, {
    id: 2,
    label: "Universidad EAFIT"
  }];

  return await new Promise(resolve => { 
    setTimeout(() => resolve(fakeUniversities), 1000);
  });
}