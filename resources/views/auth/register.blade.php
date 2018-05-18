<!-- light-blue - v4.0.0 - 2017-12-04 -->

<!DOCTYPE html>
<html>
<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
        <link href="css/application.css" rel="stylesheet">
    <link rel="shortcut icon" href="img/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta charset="utf-8">
    <script>
        /* yeah we need this empty stylesheet here. It's cool chrome & chromium fix
           chrome fix https://code.google.com/p/chromium/issues/detail?id=167083
                      https://code.google.com/p/chromium/issues/detail?id=332189
        */
    </script>
</head>
<body>
    <div class="single-widget-container mb-lg" style="margin-top: -390px;">
        <section class="widget login-widget">
            <header class="text-align-center">
                <h4>Register your account</h4>
            </header>
            <div class="body">
                @include('layouts.partials.formErrors')
                <form class="no-margin" action="{{ route('register') }}" method="POST" data-parsley-validate>
                    @csrf
                    <fieldset>
                        <div class="form-group">
                            <label for="first_name" >First Name</label>
                            <input id="first_name" type="text" class="form-control input-lg input-transparent {{ $errors->has('first_name') ? ' parsley-error' : '' }}" name="first_name" value="{{ old('first_name') }}" minlength="1" placeholder="First Name" required autofocus>
                        </div>
                        <div class="form-group">
                            <label for="last_name" >Last Name</label>
                            <input id="last_name" type="text" class="form-control input-lg input-transparent {{ $errors->has('last_name') ? ' parsley-error' : '' }}" name="last_name" value="{{ old('last_name') }}" minlength="1" placeholder="Last Name" required autofocus>
                        </div>
                        <div class="form-group">
                            <label for="phone" >Phone Number</label>
                            <input id="phone" type="text" class="form-control input-lg input-transparent {{ $errors->has('phone') ? ' parsley-error' : '' }}" name="phone" value="{{ old('phone') }}" minlength="4" placeholder="Phone Number" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="email" >Email</label>
                            <input id="email" type="email" class="form-control input-lg input-transparent {{ $errors->has('email') ? ' parsley-error' : '' }}" name="email" value="{{ old('email') }}" placeholder="Your Email" required autofocus>
                        </div>
                        <div class="form-group">
                            <label for="password" >Password</label>
                            <input id="password" name="password" type="password" class="form-control input-lg input-transparent {{ $errors->has('password') ? ' parsley-error' : '' }}" 
                                       placeholder="Your Password" minlength="6" required>

                        </div>
                        <div class="form-group">
                            <label for="password-confirm" >Confirm Password</label>
                            <input id="password-confirm" name="password_confirmation" type="password" class="form-control input-lg input-transparent" 
                                       placeholder="Confirm Password" required data-parsley-equalto="#password" >
                        </div>
                        <div class="form-group">
                            <div class="checkbox">
                                <input name="agree-tos" type="checkbox" required>
                                <label>
                                    Agree to the <a target="_blank" href="{{ url('tos.html') }}">Terms of Service</a>.
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-block btn-lg btn-info">
                            <small>Register</small>
                        </button>
                        <a class="forgot" href="{{ route('login') }}">Already a member?</a>
                    </div>
                </form>
            </div>
        </section>
    </div>
<!-- common libraries. required for every page-->
<script src="{{ asset('lib/jquery/dist/jquery.min.js') }}"></script>
<script src="{{ asset('lib/jquery-pjax/jquery.pjax.js') }}"></script>
<script src="{{ asset('lib/bootstrap-sass/assets/javascripts/bootstrap.min.js') }}"></script>
<script src="{{ asset('lib/widgster/widgster.js') }}"></script>
<script src="{{ asset('lib/underscore/underscore.js') }}"></script>
<script src="{{ asset('lib/select2/select2.min.js') }}"></script>
<script src="{{ asset('lib/moment/moment.js') }}"></script>
<script src="{{ asset('lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js') }}"></script>

<!-- common application js -->
<script src="js/app.js"></script>
<script src="js/settings.js"></script>

<!-- page specific scripts -->
    <!-- page specific libs -->
    <script src="{{ asset('lib/parsleyjs/dist/parsley.min.js') }}"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            $(".select2").select2();
            $('.date-picker').datetimepicker({
                format: 'YYYY-MM-DD'
            });
        });
    </script>
</body>
</html>