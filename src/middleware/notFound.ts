export const notFound = (req: any, res: any) => {
  const url = req.url;
  res.status(404).json({
    success: false,
    message: `Not found this url ${url}`,
  });
};
