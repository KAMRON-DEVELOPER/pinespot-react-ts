import { Button } from '@/components/ui/button';
import { useCreateListingMutation } from '@/services/listing';
import { useState } from 'react';
import { COUNTRIES } from '@/consts';

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
  const [country, setCountry] = useState('Uzbekistan');
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
  const [amenityInput, setAmenityInput] = useState('');
  const [tags, setTags] = useState<string>('');
  const [pictures, setPictures] = useState<File[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addAmenity = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setAmenities((prev) => (prev.includes(v) ? prev : [...prev, v]));
  };

  const removeAmenity = (value: string) => {
    setAmenities((prev) => prev.filter((a) => a !== value));
  };

  const movePicture = (from: number, to: number) => {
    if (to < 0 || to >= pictures.length) return;
    setPictures((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const removePicture = (index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
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
    pictures.forEach((file) => {
      fd.append('pictures[]', file);
      fd.append('pictures', file);
    });

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
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Price (USD)' type='number' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <textarea className='w-full px-3 py-2 border rounded min-h-24 bg-background text-foreground' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Rooms' type='number' value={rooms} onChange={(e) => setRooms(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Beds' type='number' value={beds} onChange={(e) => setBeds(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Baths' type='number' value={baths} onChange={(e) => setBaths(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Area (m²)' type='number' value={area} onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Floor' type='number' value={apartmentFloor} onChange={(e) => setApartmentFloor(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Total Floors' type='number' value={totalBuildingFloors} onChange={(e) => setTotalBuildingFloors(e.target.value === '' ? '' : Number(e.target.value))} />
                  <select className='w-full px-3 py-2 border rounded bg-background text-foreground' value={condition} onChange={(e) => setCondition(e.target.value as ApartmentCondition)}>
                    <option value='new'>New</option>
                    <option value='repaired'>Repaired</option>
                    <option value='old'>Old</option>
                  </select>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <select className='w-full px-3 py-2 border rounded bg-background text-foreground' value={saleType} onChange={(e) => setSaleType(e.target.value as SaleType)}>
                    <option value='rent'>Rent</option>
                    <option value='buy'>Buy</option>
                  </select>
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Requirements (optional)' value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Tags (comma separated)' value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card space-y-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Street address' value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='State/Region' value={stateOrRegion} onChange={(e) => setStateOrRegion(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='County/District' value={countyOrDistrict} onChange={(e) => setCountyOrDistrict(e.target.value)} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Postal Code' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  <select
                    className='w-full px-3 py-2 border rounded bg-background text-foreground'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Latitude' type='number' step='any' value={latitude} onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-3 py-2 border rounded bg-background text-foreground' placeholder='Longitude' type='number' step='any' value={longitude} onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card'>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={furnished} onChange={(e) => setFurnished(e.target.checked)} className='rounded bg-background text-foreground' /> Furnished
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={petsAllowed} onChange={(e) => setPetsAllowed(e.target.checked)} className='rounded bg-background text-foreground' /> Pets Allowed
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} className='rounded bg-background text-foreground' /> Elevator
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasGarden} onChange={(e) => setHasGarden(e.target.checked)} className='rounded bg-background text-foreground' /> Garden
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} className='rounded bg-background text-foreground' /> Parking
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} className='rounded bg-background text-foreground' /> Balcony
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasAc} onChange={(e) => setHasAc(e.target.checked)} className='rounded bg-background text-foreground' /> AC
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={hasHeating} onChange={(e) => setHasHeating(e.target.checked)} className='rounded bg-background text-foreground' /> Heating
                  </label>
                </div>
              </div>

              <div className='border rounded-lg p-4 bg-card'>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='Kindergarten (km)' type='number' step='any' value={distanceToKindergarten} onChange={(e) => setDistanceToKindergarten(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='School (km)' type='number' step='any' value={distanceToSchool} onChange={(e) => setDistanceToSchool(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='Hospital (km)' type='number' step='any' value={distanceToHospital} onChange={(e) => setDistanceToHospital(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='Metro (km)' type='number' step='any' value={distanceToMetro} onChange={(e) => setDistanceToMetro(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='Bus Stop (km)' type='number' step='any' value={distanceToBusStop} onChange={(e) => setDistanceToBusStop(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input className='w-full px-2 py-1 border rounded bg-background text-foreground' placeholder='Shopping (km)' type='number' step='any' value={distanceToShopping} onChange={(e) => setDistanceToShopping(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='border rounded-lg p-4 bg-card space-y-3'>
                <p className='text-sm text-muted-foreground'>Upload pictures</p>
                <input
                  onChange={(e) => setPictures((prev) => prev.concat(Array.from(e.target.files ?? [])))}
                  type='file'
                  multiple
                  accept='image/*'
                  className='block w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-md file:border file:bg-accent file:text-foreground file:cursor-pointer'
                />
                {pictures.length > 0 && (
                  <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                    {pictures.map((file, idx) => (
                      <div
                        key={idx}
                        className='relative group rounded overflow-hidden border'
                        draggable
                        onDragStart={(e) => {
                          setDragIndex(idx);
                          const imgEl = e.currentTarget.querySelector('img');
                          if (imgEl && e.dataTransfer) {
                            // Build a fixed-size ghost (consistent across breakpoints)
                            const ghost = document.createElement('div');
                            const ghostW = 128; // px
                            const ghostH = 96; // px (roughly h-24)
                            ghost.style.width = ghostW + 'px';
                            ghost.style.height = ghostH + 'px';
                            ghost.style.borderRadius = '8px';
                            ghost.style.overflow = 'hidden';
                            ghost.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                            ghost.style.background = '#000';

                            const ghostImg = document.createElement('img');
                            ghostImg.src = imgEl.src;
                            ghostImg.alt = imgEl.alt || 'drag';
                            ghostImg.style.width = '100%';
                            ghostImg.style.height = '100%';
                            ghostImg.style.objectFit = 'cover';
                            ghost.appendChild(ghostImg);

                            // Center the cursor hotspot regardless of grab position
                            const offsetX = Math.floor(ghostW / 2);
                            const offsetY = Math.floor(ghostH / 2);
                            try {
                              e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
                            } catch {}
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragIndex === null || dragIndex === idx) return;
                          movePicture(dragIndex, idx);
                          setDragIndex(null);
                        }}
                        onDragEnd={() => setDragIndex(null)}
                        aria-dropeffect='move'
                        aria-grabbed={dragIndex === idx}
                        title='Drag to reorder'
                      >
                        <img src={URL.createObjectURL(file)} alt={`pic-${idx}`} className='h-24 w-full object-cover' />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className='border rounded-lg p-4 bg-card space-y-2'>
                <p className='text-sm text-muted-foreground'>Amenities (add your own)</p>
                <div className='flex items-center gap-2'>
                  <input
                    className='flex-1 px-3 py-2 border rounded bg-background text-foreground'
                    placeholder='Type amenity and press Enter'
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addAmenity(amenityInput);
                        setAmenityInput('');
                      }
                    }}
                  />
                  <Button type='button' onClick={() => { addAmenity(amenityInput); setAmenityInput(''); }}>Add</Button>
                </div>
                {amenities.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {amenities.map((a) => (
                      <span key={a} className='px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground flex items-center gap-1'>
                        {a}
                        <button type='button' onClick={() => removeAmenity(a)} className='hover:text-destructive'>×</button>
                      </span>
                    ))}
                  </div>
                )}
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
