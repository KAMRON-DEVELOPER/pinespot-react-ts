import { Button } from '@/components/ui/button';
import { useCreateListingMutation } from '@/services/listing';
import { useState } from 'react';

type SaleType = 'buy' | 'rent';
type ApartmentCondition = 'new' | 'repaired' | 'old';

export default function NewListingPage() {
  const [createListing, { isLoading }] = useCreateListingMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState<number | ''>('');
  const [beds, setBeds] = useState<number | ''>('');
  const [baths, setBaths] = useState<number | ''>('');
  const [area, setArea] = useState<number | ''>('');
  const [apartmentFloor, setApartmentFloor] = useState<number | ''>('');
  const [totalBuildingFloors, setTotalBuildingFloors] = useState<number | ''>('');
  const [condition, setCondition] = useState<ApartmentCondition>('new');
  const [saleType, setSaleType] = useState<SaleType>('rent');
  const [requirements, setRequirements] = useState('');

  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateOrRegion, setStateOrRegion] = useState('');
  const [countyOrDistrict, setCountyOrDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');

  const [furnished, setFurnished] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasAc, setHasAc] = useState(false);
  const [hasHeating, setHasHeating] = useState(false);

  const [distanceToKindergarten, setDistanceToKindergarten] = useState<number | ''>('');
  const [distanceToSchool, setDistanceToSchool] = useState<number | ''>('');
  const [distanceToHospital, setDistanceToHospital] = useState<number | ''>('');
  const [distanceToMetro, setDistanceToMetro] = useState<number | ''>('');
  const [distanceToBusStop, setDistanceToBusStop] = useState<number | ''>('');
  const [distanceToShopping, setDistanceToShopping] = useState<number | ''>('');

  const [amenities, setAmenities] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const [pictures, setPictures] = useState<FileList | null>(null);

  const toggleAmenity = (key: string, checked: boolean) => {
    setAmenities((prev) => {
      const set = new Set(prev);
      if (checked) set.add(key);
      else set.delete(key);
      return Array.from(set);
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);

    const listingData = {
      price: price || '0',
      apartment: {
        title,
        description: description || undefined,
        rooms: typeof rooms === 'number' ? rooms : 0,
        beds: typeof beds === 'number' ? beds : 0,
        baths: typeof baths === 'number' ? baths : 0,
        address: {
          street_address: streetAddress,
          city,
          state_or_region: stateOrRegion,
          county_or_district: countyOrDistrict,
          postal_code: postalCode,
          country,
          latitude: typeof latitude === 'number' ? latitude : 0,
          longitude: typeof longitude === 'number' ? longitude : 0,
        },
        amenities,
        pictures: [],
        area: typeof area === 'number' ? area : 0,
        apartment_floor: typeof apartmentFloor === 'number' ? apartmentFloor : 0,
        total_building_floors: typeof totalBuildingFloors === 'number' ? totalBuildingFloors : 0,
        condition,
        sale_type: saleType,
        requirements: requirements || undefined,
        furnished,
        pets_allowed: petsAllowed,
        has_elevator: hasElevator,
        has_garden: hasGarden,
        has_parking: hasParking,
        has_balcony: hasBalcony,
        has_ac: hasAc,
        has_heating: hasHeating,
        distance_to_kindergarten: typeof distanceToKindergarten === 'number' ? distanceToKindergarten : 0,
        distance_to_school: typeof distanceToSchool === 'number' ? distanceToSchool : 0,
        distance_to_hospital: typeof distanceToHospital === 'number' ? distanceToHospital : 0,
        distance_to_metro: typeof distanceToMetro === 'number' ? distanceToMetro : 0,
        distance_to_bus_stop: typeof distanceToBusStop === 'number' ? distanceToBusStop : 0,
        distance_to_shopping: typeof distanceToShopping === 'number' ? distanceToShopping : 0,
      },
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const fd = new FormData();
    fd.append('listing_data', JSON.stringify(listingData));
    if (pictures) {
      Array.from(pictures).forEach((file) => {
        fd.append('pictures', file);
      });
    }

    try {
      const res = await createListing(fd).unwrap();
      if (typeof res === 'object' && 'message' in res) {
        setMessage(String((res as any).message));
      } else {
        setMessage('Your listing created successfully!');
      }
    } catch (err: any) {
      const m = err?.data?.error || err?.error || 'Failed to create listing';
      setErrorMsg(String(m));
    }
  };

  return (
    <div className='min-h-[calc(100vh-56px)] bg-background'>
      <div className='max-w-5xl mx-auto p-4 sm:p-6'>
        <h1 className='text-2xl font-semibold mb-4 text-foreground'>Add a New Listing</h1>

        {message && (
          <div className='mb-4 rounded-md border bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-200 px-4 py-2'>
            {message}
          </div>
        )}
        {errorMsg && (
          <div className='mb-4 rounded-md border bg-destructive/10 text-destructive px-4 py-2'>
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div className='lg:col-span-2 space-y-4'>
              <div className='border rounded-lg p-4 bg-card space-y-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <input className='w-full px-3 py-2 border rounded' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Price' type='number' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <textarea className='w-full px-3 py-2 border rounded min-h-24' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  <input className='w-full px-3 py-2 border rounded' placeholder='Rooms' type='number' value={rooms} onChange={(e) => setRooms(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Beds' type='number' value={beds} onChange={(e) => setBeds(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Baths' type='number' value={baths} onChange={(e) => setBaths(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Area (m²)' type='number' value={area} onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <input className='w-full px-3 py-2 border rounded' placeholder='Floor' type='number' value={apartmentFloor} onChange={(e) => setApartmentFloor(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Total Floors' type='number' value={totalBuildingFloors} onChange={(e) => setTotalBuildingFloors(e.target.value === '' ? '' : Number(e.target.value))} />
                  <select className='w-full px-3 py-2 border rounded' value={condition} onChange={(e) => setCondition(e.target.value as ApartmentCondition)}>
                    <option value='new'>New</option>
                    <option value='repaired'>Repaired</option>
                    <option value='old'>Old</option>
                  </select>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <select className='w-full px-3 py-2 border rounded' value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
                    <option value='rent'>Rent</option>
                    <option value='buy'>Buy</option>
                  </select>
                  <input className='w-full px-3 py-2 border rounded' placeholder='Requirements (optional)' value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Tags (comma separated)' value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card space-y-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <input className='w-full px-3 py-2 border rounded' placeholder='Street address' value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='State/Region' value={stateOrRegion} onChange={(e) => setStateOrRegion(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='County/District' value={countyOrDistrict} onChange={(e) => setCountyOrDistrict(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Postal Code' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Latitude' type='number' step='any' value={latitude} onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded' placeholder='Longitude' type='number' step='any' value={longitude} onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card'>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={furnished} onChange={(e) => setFurnished(e.target.checked)} className='rounded' /> Furnished
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={petsAllowed} onChange={(e) => setPetsAllowed(e.target.checked)} className='rounded' /> Pets Allowed
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} className='rounded' /> Elevator
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasGarden} onChange={(e) => setHasGarden(e.target.checked)} className='rounded' /> Garden
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} className='rounded' /> Parking
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} className='rounded' /> Balcony
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasAc} onChange={(e) => setHasAc(e.target.checked)} className='rounded' /> AC
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasHeating} onChange={(e) => setHasHeating(e.target.checked)} className='rounded' /> Heating
                  </label>
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card'>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <input className='w-full px-2 py-1 border rounded' placeholder='Kindergarten (m)' type='number' value={distanceToKindergarten} onChange={(e) => setDistanceToKindergarten(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded' placeholder='School (m)' type='number' value={distanceToSchool} onChange={(e) => setDistanceToSchool(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded' placeholder='Hospital (m)' type='number' value={distanceToHospital} onChange={(e) => setDistanceToHospital(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded' placeholder='Metro (m)' type='number' value={distanceToMetro} onChange={(e) => setDistanceToMetro(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded' placeholder='Bus Stop (m)' type='number' value={distanceToBusStop} onChange={(e) => setDistanceToBusStop(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded' placeholder='Shopping (m)' type='number' value={distanceToShopping} onChange={(e) => setDistanceToShopping(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='border rounded-lg p-4 bg-card'>
                <p className='text-sm text-muted-foreground mb-2'>Upload pictures</p>
                <input onChange={(e) => setPictures(e.target.files)} type='file' multiple accept='image/*' className='block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border file:bg-accent file:text-foreground file:cursor-pointer' />
              </div>
              <div className='border rounded-lg p-4 bg-card space-y-2'>
                <p className='text-sm text-muted-foreground'>Amenities</p>
                <div className='grid grid-cols-2 gap-2'>
                  {['wifi', 'pool', 'gym', 'security', 'playground', 'concierge'].map((am) => (
                    <label key={am} className='flex items-center gap-2 text-sm'>
                      <input type='checkbox' className='rounded' checked={amenities.includes(am)} onChange={(e) => toggleAmenity(am, e.target.checked)} />
                      {am}
                    </label>
                  ))}
                </div>
              </div>
              <div className='border rounded-lg p-4 bg-card'>
                <Button type='submit' disabled={isLoading} className='w-full'>
                  {isLoading ? 'Saving...' : 'Save Listing'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
