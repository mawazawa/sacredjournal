interface SaveResult {
  success: boolean
  error: string | null
  wordCount: number
}

export async function handleEntrySave(
  supabase: any,
  entryId: string,
  title: string,
  content: string
): Promise<SaveResult> {
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length

  const { error } = await supabase
    .from('entries')
    .update({
      title,
      content,
      word_count: wordCount
    })
    .eq('id', entryId)

  // FIX: Return error information to caller for user feedback
  if (error) {
    return { success: false, error: error.message, wordCount }
  }

  return { success: true, error: null, wordCount }
}
