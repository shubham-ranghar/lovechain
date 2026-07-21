import { supabase, Couple, CoupleContent } from './supabase';

// Generate a random slug from names
export function generateSlug(name1: string, name2: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = `${clean(name1)}-and-${clean(name2)}`;
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

// Generate a secure random edit token
export function generateEditToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Create a new couple
export async function createCouple(name1: string, name2: string, recoveryEmail?: string): Promise<{ couple: Couple; editToken: string } | null> {
  const slug = generateSlug(name1, name2);
  const editToken = generateEditToken();
  
  const defaultContent: CoupleContent = {
    partnerName: name2,
    welcomeMessage: 'Every page here is a tiny piece of us. Take your time.',
    dateQuestion: 'Will you go on a date with me?',
    letterText: `From the very first moment, something about you felt like home.\n\nEvery laugh, every small glance, every ordinary Tuesday with you —\nthey've quietly become my favorite parts of being alive.\n\nThank you for being kind, for being brave, for being wildly, unapologetically you.\nI don't know exactly what tomorrow looks like, but I know I want to see it with you.\n\nYours, always.`,
    reasons: [
      'Your smile lights up every room.',
      'The way you laugh at your own jokes.',
      'How you care about the tiniest things.',
      'Your kindness to strangers.',
      'The way you say my name.',
      'You make ordinary days feel special.',
    ],
    galleryPhotos: [],
    compliments: [
      'Your laugh is my favorite sound.',
      'You make ordinary Tuesdays feel like holidays.',
      'I love the way you scrunch your nose.',
      'You are the plot twist I hoped for.',
      'You are home.',
    ],
    constellationMemories: [
      { x: 30, y: 35, memory: 'The night we first talked till sunrise.' },
      { x: 50, y: 50, memory: 'This exact moment, right now.' },
      { x: 70, y: 65, memory: 'You. Always you.' },
    ],
    gardenStages: [
      { label: 'Seed', caption: 'It started small — a shy hello, a nervous smile.' },
      { label: 'Sprout', caption: 'Little green shoots: late-night texts, inside jokes.' },
      { label: 'Leaves', caption: 'We learned each other\'s weather, and stayed anyway.' },
      { label: 'Bud', caption: 'Something bigger, quieter, more certain took shape.' },
      { label: 'Bloom', caption: 'And here we are — in full color, still growing.' },
    ],
    finaleMessage: 'Now, and every day after this one.',
    enabledPages: ['home', 'date', 'letter', 'reasons', 'finale'],
  };

  const { data, error } = await supabase
    .from('couples')
    .insert({
      slug,
      edit_token: editToken,
      content: defaultContent,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating couple:', error);
    return null;
  }

  return { couple: data as Couple, editToken };
}

// Get couple by slug (for viewing) - case-insensitive
export async function getCoupleBySlug(slug: string): Promise<Couple | null> {
  console.log('[getCoupleBySlug] Fetching couple with slug:', slug);
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .ilike('slug', slug)
    .single();

  if (error) {
    console.error('[getCoupleBySlug] Supabase error:', error);
    console.error('[getCoupleBySlug] Error code:', error.code);
    console.error('[getCoupleBySlug] Error message:', error.message);
    console.error('[getCoupleBySlug] Error details:', error.details);
    console.error('[getCoupleBySlug] Error hint:', error.hint);
    return null;
  }

  console.log('[getCoupleBySlug] Successfully fetched couple:', data);
  return data as Couple;
}

// Get couple by edit token (for editing)
export async function getCoupleByEditToken(editToken: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('edit_token', editToken)
    .single();

  if (error) {
    console.error('Error fetching couple by edit token:', error);
    return null;
  }

  return data as Couple;
}

// Update couple content
export async function updateCoupleContent(
  editToken: string,
  content: Partial<CoupleContent>
): Promise<boolean> {
  const { error } = await supabase
    .from('couples')
    .update({ content })
    .eq('edit_token', editToken);

  if (error) {
    console.error('Error updating couple content:', error);
    return false;
  }

  return true;
}

// Upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; error: string | null }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    return { url: '', error: error.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

// Delete file from Supabase Storage
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
}

// Compress image client-side before upload (browser only)
export async function compressImage(file: File, maxWidth: number = 1600): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('compressImage can only be used in the browser');
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to compress image'));
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
