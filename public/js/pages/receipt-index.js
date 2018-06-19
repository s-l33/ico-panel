$(function () {

    function initDataTables() {
        /* Set the defaults for DataTables initialisation */
        $.extend(true, $.fn.dataTable.defaults, {
            "sDom": "<'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "sPaginationType": "bootstrap",
            "oLanguage": {
                "sLengthMenu": "_MENU_ records per page"
            }
        });


        /* Default class modification */
        $.extend($.fn.dataTableExt.oStdClasses, {
            "sWrapper": "dataTables_wrapper form-inline"
        });


        /* API method to get paging information */
        $.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
            return {
                "iStart": oSettings._iDisplayStart,
                "iEnd": oSettings.fnDisplayEnd(),
                "iLength": oSettings._iDisplayLength,
                "iTotal": oSettings.fnRecordsTotal(),
                "iFilteredTotal": oSettings.fnRecordsDisplay(),
                "iPage": oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
                "iTotalPages": oSettings._iDisplayLength === -1 ?
                    0 : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
            };
        };


        /* Bootstrap style pagination control */
        $.extend($.fn.dataTableExt.oPagination, {
            "bootstrap": {
                "fnInit": function (oSettings, nPaging, fnDraw) {
                    var oLang = oSettings.oLanguage.oPaginate;
                    var fnClickHandler = function (e) {
                        e.preventDefault();
                        if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                            fnDraw(oSettings);
                        }
                    };

                    $(nPaging).append(
                        '<ul class="pagination no-margin">' +
                        '<li class="prev disabled"><a href="#">' + oLang.sPrevious + '</a></li>' +
                        '<li class="next disabled"><a href="#">' + oLang.sNext + '</a></li>' +
                        '</ul>'
                    );
                    var els = $('a', nPaging);
                    $(els[0]).bind('click.DT', {
                        action: "previous"
                    }, fnClickHandler);
                    $(els[1]).bind('click.DT', {
                        action: "next"
                    }, fnClickHandler);
                },

                "fnUpdate": function (oSettings, fnDraw) {
                    var iListLength = 5;
                    var oPaging = oSettings.oInstance.fnPagingInfo();
                    var an = oSettings.aanFeatures.p;
                    var i, ien, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

                    if (oPaging.iTotalPages < iListLength) {
                        iStart = 1;
                        iEnd = oPaging.iTotalPages;
                    } else if (oPaging.iPage <= iHalf) {
                        iStart = 1;
                        iEnd = iListLength;
                    } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                        iStart = oPaging.iTotalPages - iListLength + 1;
                        iEnd = oPaging.iTotalPages;
                    } else {
                        iStart = oPaging.iPage - iHalf + 1;
                        iEnd = iStart + iListLength - 1;
                    }

                    for (i = 0, ien = an.length; i < ien; i++) {
                        // Remove the middle elements
                        $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                        // Add the new list items and their event handlers
                        for (j = iStart; j <= iEnd; j++) {
                            sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                            $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                                .insertBefore($('li:last', an[i])[0])
                                .bind('click', function (e) {
                                    e.preventDefault();
                                    oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                                    fnDraw(oSettings);
                                });
                        }

                        // Add / remove disabled classes from the static elements
                        if (oPaging.iPage === 0) {
                            $('li:first', an[i]).addClass('disabled');
                        } else {
                            $('li:first', an[i]).removeClass('disabled');
                        }

                        if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                            $('li:last', an[i]).addClass('disabled');
                        } else {
                            $('li:last', an[i]).removeClass('disabled');
                        }
                    }
                }
            }
        });

        var unsortableColumns = [];
        $('#datatable-table').find('thead th').each(function () {
            if ($(this).hasClass('no-sort')) {
                unsortableColumns.push({
                    "bSortable": false
                });
            } else {
                unsortableColumns.push(null);
            }
        });

        $("#datatable-table").dataTable({
            "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "oLanguage": {
                "sLengthMenu": "_MENU_",
                "sInfo": "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries"
            },
            "oClasses": {
                "sFilter": "pull-right",
                "sFilterInput": "form-control input-transparent ml-sm"
            },
            "pageLength": 25,
            "order": [],
            "aoColumns": unsortableColumns
        });

        $(".dataTables_length select").selectpicker({
            width: 'auto'
        });
    }

    function pageLoad() {
        $('.widget').widgster();
        initDataTables();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $('.btn-approve').click(function (e) {
            e.stopPropagation();
            var _this = this;
            swal({
                title: "Are you sure?",
                text: "Tokens will be delivered to the user after approved.",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, approve it!",
                cancelButtonText: "No, cancel please!"
            }).then(result => {
                if (result.value) {
                    $.get(
                        $(_this).data('href'),
                        function (response) {
                            if (response.success) {
                                swal({
                                    title: "Approved",
                                    text: "Token has been delivered.",
                                    type: "success",
                                    timer: 800
                                });
                                $(_this).closest('td').html('<span class="badge bg-gray-lighter text-gray fw-semi-bold"><i class="fa fa-check"></i>Approved</span>');
                            } else {
                                swal({
                                    title: "Failed",
                                    text: response.message,
                                    type: "success",
                                    timer: 2000
                                });
                                $(_this).closest('td').html('<span class="badge bg-gray-lighter text-gray fw-semi-bold"><i class="fa fa-check"></i>Approved</span>');
                            }
                        },
                        'json'
                    ).fail(function () {
                        swal("Failed", "Sorry, Error occured, Please try again later.", "error");
                    });
                } else {
                    swal({
                        title: "Cancelled",
                        text: "You canceled to approve.",
                        type: "info",
                        timer: 800
                    });
                }
            });
        });

        $('.btn-dismiss').click(function (e) {
            e.stopPropagation();
            var _this = this;
            swal({
                title: "Are you sure?",
                text: "This bank receipt will be ignored and archived.",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Dismiss!",
                cancelButtonText: "No, cancel please!"
            }).then(result => {
                if (result.value) {
                    $.get(
                        $(_this).data('href'),
                        function (response) {
                            if (response.success) {
                                swal({
                                    title: "Dismissed",
                                    text: "Receipt archived.",
                                    type: "success",
                                    timer: 800
                                });
                                $(_this).closest('td').html('<span class="badge bg-gray-lighter text-gray-light"><i class="fa fa-ban"></i> Dismissed</span>');
                            }
                        },
                        'json'
                    ).fail(function () {
                        swal("Failed", "Sorry, Error occured, Please try later.", "error");
                    });
                } else {
                    swal({
                        title: "Cancelled",
                        text: "You canceled to dismiss.",
                        type: "info",
                        timer: 800
                    });
                }
            });
        });
    }

    pageLoad();
    PjaxApp.onPageLoad(pageLoad);

});