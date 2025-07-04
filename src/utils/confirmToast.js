const confirmToast = (onConfirm) => {
  const toastId = toast(
    ({ closeToast }) => (
      <div>
        <p>Silinsin?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => {
              onConfirm(); 
              toast.dismiss(toastId); 
            }}
            style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
          >Sil</button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{ background: '#555', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
          >Ləğv et</button>
        </div>
      </div>
    ),
    { autoClose: false, closeOnClick: false }
  );
};

const handleDelete = (id) => {
  confirmToast(async () => {
    try {
      await axiosInstance.delete(`/admin/categories/${id}`);
      toast.success("✅ Silindi");
      fetchCategories();
    } catch (err) {
      toast.error("❌ Silinmədi");
    }
  });
};
