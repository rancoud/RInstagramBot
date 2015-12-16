# Instagram API is dead
If you think it will be easy to use Instagram API you are a fool!  
Lot of process to review your application.  
Lot of constraints.  
In sandbox mode you will have only access to your user and his data.  
So a lot of endpoint won't work as expected in documentation.  
**Currently I will try to get all permission for this works, BUT if I can't I will stop developpement for this dead API**

# RInstagramBot
Bot for Instagram

# Nota Bene
Callback URI must be exact with what you declare.  
Here the authorized callbacks
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th>REGISTERED REDIRECT URI</th>
        <th>REDIRECT_URI PARAMETER PASSED TO /AUTHORIZE</th>
        <th style="width: 20px;">VALID?</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>http://yourcallback.com/</td>
          <td>http://yourcallback.com/</td>
          <td>yes</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/</td>
        <td>http://yourcallback.com/?this=that</td>
        <td>yes</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/?this=that</td>
        <td>http://yourcallback.com/</td>
        <td>no</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/?this=that</td>
        <td>http://yourcallback.com/?this=that&another=true </td>
        <td>yes</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/?this=that</td>
        <td>http://yourcallback.com/?another=true&this=that</td>
        <td>no</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/callback</td>
        <td>http://yourcallback.com/</td>
        <td>no</td>
      </tr>
      <tr>
        <td>http://yourcallback.com/callback</td>
        <td>http://yourcallback.com/callback?type=mobile</td>
        <td>yes</td>
      </tr>
    </tbody>
</table>
