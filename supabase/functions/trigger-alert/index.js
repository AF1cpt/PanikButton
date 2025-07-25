import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { latitude, longitude } = await req.json()
    
    // Get the user from the request headers (set by Supabase Auth)
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the JWT token and get user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    // Create the alert in the database
    const { data: alert, error: alertError } = await supabase
      .from('alerts')
      .insert([
        {
          user_id: user.id,
          location: `POINT(${longitude} ${latitude})`,
          status: 'active',
        }
      ])
      .select()
      .single()

    if (alertError) {
      throw alertError
    }

    // Find nearby users within 2km radius
    const { data: nearbyUsers, error: nearbyError } = await supabase
      .rpc('get_nearby_users', {
        alert_location: `POINT(${longitude} ${latitude})`,
        radius_meters: 2000
      })

    if (nearbyError) {
      console.error('Error finding nearby users:', nearbyError)
    }

    // Send push notifications to nearby users
    if (nearbyUsers && nearbyUsers.length > 0) {
      for (const nearbyUser of nearbyUsers) {
        // Skip the user who triggered the alert
        if (nearbyUser.user_id === user.id) continue

        try {
          // Here you would integrate with your push notification service
          // For now, we'll just log the notification
          console.log(`Sending notification to user ${nearbyUser.user_id} at ${nearbyUser.email}`)
          
          // Example: Send push notification via Expo
          // await sendPushNotification({
          //   to: nearbyUser.expo_push_token,
          //   title: 'Emergency Alert',
          //   body: 'An emergency has been reported nearby. Please check the app for details.',
          //   data: { alertId: alert.id }
          // })
        } catch (notificationError) {
          console.error('Error sending notification:', notificationError)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        alertId: alert.id,
        nearbyUsersCount: nearbyUsers ? nearbyUsers.length : 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in trigger-alert function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
}) 