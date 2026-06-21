import { HttpInterceptorFn } from '@angular/common/http';

export const jWTHeaderInterceptor: HttpInterceptorFn = (req, next) => {
<<<<<<< HEAD
  const reqClone = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJtZWRpY28iLCJyb2xlIjoiRE9DIiwiaWF0IjoxNzc2Nzg3OTE4LCJleHAiOjE3NzY3OTE1MTh9.Au8X15QDtnLaz7JnQl-iGzNc-wnf-sECuO--6EceYDE`,
    ),
  });
  return next(reqClone);
=======
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`),
  });
  return next(reqWithHeader);
>>>>>>> upstream/uf15-2026/asyncValidator
};
